const mongoose = require('mongoose')
const Location = require('../models/location')

exports.location_fingerprint = (req, res, next) => {
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
        message: 'Could not get location'
      })
    })
}

exports.location_get_specific = (req, res, next) => {
  const id = req.params.id
  Location.findById(id)
    .populate('space')
    .select('_id space date')
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          _id: doc._id,
          space: doc.space,
          date: doc.date
        })
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' })
      }
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.location_correction = (req, res, next) => {
  const location = new Location({
    _id: mongoose.Types.ObjectId(),
    aps: req.body.aps,
    date: Date.now()
  })

  location
    .save()
    .then(result => {
      // actually here should be the algorithm to detect geographical location
      console.log('received location ' + result)
      res.status(200).json({
        location: location,
        message: 'Location received successfully'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err,
        message: 'Could not get location'
      })
    })
}
