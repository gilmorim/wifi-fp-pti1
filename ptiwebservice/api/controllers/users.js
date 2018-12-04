const User = require('../models/user')
const Space = require('../models/space')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.users_get_all = (req, res, next) => {
  User.find()
    .select('_id email rank firstName lastName registrationDate')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            _id: doc._id,
            email: doc.email,
            rank: doc.rank,
            firstName: doc.firstName,
            lastName: doc.lastName,
            registrationDate: doc.registrationDate,
            request: {
              description: 'To get more details about user ' + doc.firstName + ' ' + doc.lastName,
              type: 'GET',
              url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/users/' + doc._id
            }
          }
        })
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.users_register = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      })
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        registrationDate: Date.now(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        rank: req.body.rank
      })
      user
        .save()
        .then(result => {
          console.log(result)
          res.status(201).json({
            message: 'Created user successfully',
            createdUser: {
              _id: result.id,
              email: result.email,
              rank: result.rank,
              firstName: result.firstName,
              lastName: result.lastName
            },
            request: {
              description: 'To get more details about user ' + result.firstName + ' ' + result.lastName,
              type: 'GET',
              url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/users/' + result._id
            }
          })
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({
            error: err,
            message: 'Could not add user'
          })
        })
    }
  })
}

exports.users_get_specific = (req, res, next) => {
  const id = req.params.id
  User.findById(id)
    .select('_id email rank firstName lastName registrationDate')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          user: doc
        })
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' })
      }
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.users_delete = (req, res, next) => {
  const id = req.params.id
  User.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        // a bit redundant but ok
        message: 'User successfully deleted'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.users_correct = (req, res, next) => {
  const id = req.params.id
  const updateOps = {}

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  User.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User successfully updated',
        request: {
          description: 'To get full info on updated user',
          type: 'GET',
          url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/users/' + id
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}

exports.users_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          console.log(err)
          return res.status(401).json({
            message: 'Auth failed'
          })
        }
        if (result) {
          const token = jwt.sign({
            email: user[0].email,
            _id: user[0]._id,
            rank: user[0].rank
          }, process.env.JWT_KEY,
          {
            expiresIn: '1h'
          })
          Space.find({ owner: user[0]._id })
            .select('_id')
            .exec()
            .then(userSpaces => {
              return res.status(200).json({
                message: 'Auth successful',
                token: token,
                spaces: userSpaces
              })
            })
            .catch(err => {
              res.status(500).json({
                err: err
              })
              console.log(err)
            })
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
}
