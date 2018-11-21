const mongoose = require('mongoose')

const correctionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  wrongReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferencePoint',
    required: true
  },
  correctReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferencePoint',
    required: true
  },
  corrections: [{
    date: Date,
    intensity: Number
  }],
  receivedCorrections: Number
})

module.exports = mongoose.model('Correction', correctionSchema)
