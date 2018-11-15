const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Space = require('../models/space')

router.get('/', (req, res, next) => {
  Space.find()
    .select('_id name description additionDate owner imageFile referencePoints')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        spaces: docs.map(doc => {
          return {
            _id: doc._id,
            name: doc.name,
            description: doc.description,
            additionDate: doc.additionDate,
            owner: doc.owner,
            imageFile: doc.imageFile,
            referencePoints: doc.referencePoints,
            requests: {
              space: {
                description: 'To get more details about space ' + doc.name,
                type: 'GET',
                url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/spaces/' + doc._id
              },
              owner: {
                description: 'To get more details about owner ',
                type: 'GET',
                url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/users/' + doc.owner
              },
              referencePoints: doc.referencePoints.map(result => {
                return {
                  description: 'To get more info on this reference point',
                  type: 'GET',
                  url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/referencepoints/' + result._id
                }
              })
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

router.post('/', (req, res, next) => {
  const space = new Space({
    _id: new mongoose.Types.ObjectId(),
    description: req.body.description,
    additionDate: Date.now(),
    owner: req.body.owner,
    imageFile: req.body.imageFile,
    referencesCount: req.body.referencePoints.length,
    referencePoints: req.body.referencePoints
  })

  space
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Created space successfully',
        createdSpace: {
          _id: result.id,
          name: result.name,
          description: result.description,
          request: {
            description: 'To get more details about space ' + result.name,
            type: 'GET',
            url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/spaces/' + result._id
          }
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err,
        message: 'Could not add space'
      })
    })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  Space.findById(id)
    .populate('owner referencePoints', '_id coordinateX coordinateY space aps email rank username')
    .select('_id name description additionDate owner imageFile referencePoints')
    .populate()
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          space: doc,
          referencePoints: doc.referencePoints.map(result => {
            return {
              description: 'To get more info on this reference point',
              type: 'GET',
              url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/referencepoints/' + result._id
            }
          }),
          request: {
            description: 'To get a list of all spaces',
            type: 'GET',
            url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/spaces/'
          }
        })
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' })
      }
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

router.delete('/', (req, res, next) => {
  const id = req.params.id
  Space.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'message deleted'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

// check later
router.patch('/', (req, res, next) => {
})

module.exports = router
