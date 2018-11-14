const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')

// return all users
router.get('/', (req, res, next) => {
  User.find()
    .exec()
    .then(docs => {
      // check arguably not necessary
      if (docs.length >= 0) {
        res.status(200).json(docs)
      } else {
        res.status(404).json({
          message: 'No entries found'
        })
      }
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
    email: req.body.email,
    rank: req.body.rank,
    username: req.body.username,
    password: req.body.password,
    cardNumber: req.body.cardNumber,
    cvv: req.body.cvv,
    cardExpiration: req.body.cardExpiration,
    registrationDate: Date.now()
  })
  user
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        createdUser: user,
        message: 'Posted user successfully'
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
  User.findById(id).exec().then(doc => {
    console.log('retrieved from database:', doc)
    if (doc) {
      res.status(200).json(doc)
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
      res.status(200).json(result)
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
      console.log(result)
      res.status(200).json(result)
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
