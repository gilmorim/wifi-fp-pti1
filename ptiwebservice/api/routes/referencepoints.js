const express = require('express')
const router = express.Router()
const ReferencePoint = require('../models/referencePoint')
const mongoose = require('mongoose')

router.get('/', (req, res, next) => {
  ReferencePoint.find()
    .exec()
    .then(docs => {
      console.log(docs)
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

router.post('/', (req, res, next) => {
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
      console.log(referencePoint)
      res.status(201).json({
        createdReferencePoint: referencePoint,
        message: 'referencePoint correctly posted'
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err,
        message: 'Could not add referencePoint'
      })
    })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  ReferencePoint.findById(id).exec().then(doc => {
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

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  ReferencePoint.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
})

router.patch('/:id', (req, res, next) => {

})

module.exports = router
