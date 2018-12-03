const ReferencePoint = require('../models/referencePoint')
const mongoose = require('mongoose')

exports.referencepoints_get_all = (req, res, next) => {
  ReferencePoint.find()
    .select('_id coordinateX coordinateY space aps')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        referencePoints: docs.map(doc => {
          return {
            _id: doc._id,
            coordinateX: doc.coordinateX,
            coordinateY: doc.coordinateY,
            space: doc.space,
            aps: doc.aps,
            request: {
              description: 'To get more details about this reference point ',
              type: 'GET',
              url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/referencepoints/' + doc._id
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

exports.referencepoints_add = (req, res, next) => {
  const referencePoint = new ReferencePoint({
    _id: new mongoose.Types.ObjectId(),
    coordinateX: req.body.coordinateX,
    coordinateY: req.body.coordinateY,
    space: req.body.space,
    aps: req.body.aps,
    additionDate: Date.now()
  })

  referencePoint
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Created referencePoint successfully',
        createdReferencePoint: {
          _id: result._id,
          coordinateX: result.coordinateX,
          coordinateY: result.coordinateY,
          space: result.space
        },
        request: {
          description: 'To get information about this reference point ',
          type: 'GET',
          url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/referencepoints/' + result._id
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err,
        message: 'Could not add referencePoint'
      })
    })
}

exports.referencepoints_get_specific = (req, res, next) => {
  const id = req.params.id
  ReferencePoint.findById(id)
    .populate('space', 'referecePoints _id owner')
    .select('_id coordinateX coordinateY space aps additionDate')
    .exec()
    .then(doc => {
      console.log('retrieved from database:', doc)
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

exports.referencepoints_delete = (req, res, next) => {
  const id = req.params.id
  ReferencePoint.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Reference point successfully deleted'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.referencepoints_correct = (req, res, next) => {
  const id = req.params.id
  const updateOps = {}

  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  ReferencePoint.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Reference point successfully updated',
        request: {
          description: 'To get full info on updated reference point',
          type: 'GET',
          url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/referencepoints/' + id
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
