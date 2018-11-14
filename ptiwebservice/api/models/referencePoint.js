const mongoose = require('mongoose')

const referencePointSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  coordinateX: Number,
  coordinateY: Number,
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space'
  },
  aps: [{
    mac: String,
    intensity: Number
  }],
  additionDate: Date
})

module.exports = mongoose.model('ReferencePoint', referencePointSchema)
