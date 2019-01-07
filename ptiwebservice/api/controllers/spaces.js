const mongoose = require('mongoose')
const multer = require('multer')
const uploads = multer({ dest: '../public/images/' })
const Space = require('../models/space')

exports.spaces_get_all = (req, res, next) => {
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
}

exports.spaces_add = (req, res, next) => {
  const space = new Space({
    _id: new mongoose.Types.ObjectId(),
    additionDate: Date.now(),
    name: req.body.name,
    description: req.body.description,
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
}

exports.spaces_get_specific = (req, res, next) => {
  const id = req.params.id
  Space.findById(id)
    .populate('owner referencePoints', '_id coordinateX coordinateY space aps email rank firstName lastName')
    .select('_id name description additionDate owner imageFile referencePoints')
    .populate()
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).json({
          space: doc,
          referencePointsRequests: doc.referencePoints.map(result => {
            return {
              description: 'To get more info on this reference point',
              type: 'GET',
              url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/referencepoints/' + result._id
            }
          })
        })
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' })
      }
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.spaces_delete = (req, res, next) => {
  const id = req.params.id
  Space.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Space successfully deleted'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.spaces_correct = (req, res, next) => {
  const id = req.params.id
  const updateOps = {}

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  Space.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Space successfully updated',
        request: {
          description: 'To get full info on updated space',
          type: 'GET',
          url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/spaces/' + id
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
