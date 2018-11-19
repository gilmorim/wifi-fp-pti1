const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

// return all users
router.get('/', (req, res, next) => {
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
})

// add new owner
router.post('/register/owner', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Registration failed'
        })
      } else {
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
              rank: 'owner'
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
    })
})

// add new premium
router.post('/register/premium', (req, res, next) => {
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
        rank: 'premium'
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
})

// get specific user
router.get('/:id', (req, res, next) => {
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
})

// delete a user
router.delete('/:id', (req, res, next) => {
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
})

// correct user
/*
  IMPORTANT:
  Object in request body must be an array such as:
    [
      {"propName": "name of the Property", "value": "Value of the property"}
    ]

   EXAMPLE - change user email and password
    [
      {"propName":"email", "value":"newEmail@test.com"},
      {"propName":"password", "value":"hunter3"}
    ]
 */
router.patch('/:id', (req, res, next) => {
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
})

// handle login here
router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        })
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          })
        }
        if (result) {
          const token = jwt.sign({
            email: user[0].email,
            _id: user[0]._id
          }, process.env.JWT_KEY,
          {
            expiresIn: '1h'
          }
          )
          return res.status(200).json({
            message: 'Auth successful',
            token: token
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
})

module.exports = router
