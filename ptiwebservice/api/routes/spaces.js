const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Space = require('../models/space')

router.get('/', (req, res, next) => {
  Space.find()
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
      console.log(space)
      res.status(201).json({
        createdSpace: space,
        message: 'Space correctly posted'
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
  Space.findById(id).exec().then(doc => {
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

router.delete('/', (req, res, next) => {
  const id = req.params.id
  Space.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result)
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
