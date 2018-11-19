const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')

// return all users
router.get('/', (req, res, next) => {
  User.find()
    .select('_id email rank username registrationDate')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        users: docs.map(doc => {
          return {
            _id: doc._id,
            email: doc.email,
            rank: doc.rank,
            username: doc.username,
            registrationDate: doc.registrationDate,
            request: {
              description: 'To get more details about user ' + doc.username,
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

// add new user
router.post('/', (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    registrationDate: Date.now(),
    email: req.body.email,
    rank: req.body.rank,
    username: req.body.username,
    password: req.body.password
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
          username: result.username,
          registrationDate: result.registrationDate
        },
        request: {
          description: 'To get more details about user ' + result.username,
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
})

// get specific user
router.get('/:id', (req, res, next) => {
  const id = req.params.id
  User.findById(id)
    .select('_id email rank username registrationDate')
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
  User.remove({ _id: id })
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

})

module.exports = router
