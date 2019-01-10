const mongoose = require('mongoose')
const Location = require('../models/location')
const ReferencePoint = require('../models/referencePoint')

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
      const macAddresses = []
      for (var ap in req.body.aps) { macAddresses.push(req.body.aps[ap].mac) }
      ReferencePoint.aggregate([{
        $match: {
          aps: {
            $elemMatch: {
              mac: {
                $in: macAddresses
              }
            }
          }
        }/* ideally would have kept going with aggregate framework, but time ran short... */
      }], (err, docs) => {
        if (err) console.log(err)
        else {
          var bestChoice = {
            commonMacs: 0,
            refPointId: '',
            index: 0
          }

          for (var i = 0; i !== docs.length; i++) {
            var commonMacs = 0
            for (var j = 0; j !== docs[i].aps.length; j++) {
              for (var k = 0; k !== macAddresses.length; k++) {
                if (macAddresses[k] === docs[i].aps[j].mac) {
                  commonMacs++
                }
              }
            }
            if (commonMacs > bestChoice.commonMacs) {
              bestChoice.commonMacs = commonMacs
              bestChoice.refPointId = docs[i]._id
              bestChoice.index = i
            }
          }
          res.status(200).json({ doc: docs[bestChoice.index] })
        }
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
