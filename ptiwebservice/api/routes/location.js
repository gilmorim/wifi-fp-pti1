const express = require('express')
const router = express.Router()
const Location = require('../models/location')
const mongoose = require('mongoose')

// User gives info of his wifi fingerprint, and is given his geographical position
router.post('/', (req, res, next) => {
  const location = new Location({
    _id: mongoose.Types.ObjectId(),
    aps: req.body.aps,
    date: Date.now()
  })

  location
    .save()
    .then(result => {
      // actually here should be the algorithm to detect geographical location
      console.log(result)
      res.status(200).json({
        location: location,
        message: 'Location received successfully'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err,
        message: 'Could not add location'
      })
    })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  Location.findById(id).exec().then(doc => {
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

// Premium user can correct his position - WIP
router.post('/correction', (req, res, next) => {
})

module.exports = router
