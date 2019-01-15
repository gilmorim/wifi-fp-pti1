const mongoose = require('mongoose')

const referencePointSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  coordinateX: {
    type: Number,
    required: true
  },
  coordinateY: {
    type: Number,
    required: true
  },
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space',
    required: true
  },
  aps: {
    type: [{
      mac: {
        type: String,
        match: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
      },
      intensity: Number
    }],
    required: true
  },
  additionDate: Date
})

module.exports = mongoose.model('ReferencePoint', referencePointSchema)
