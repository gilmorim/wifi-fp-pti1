const mongoose = require('mongoose')

const referencePointSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  referenceNumber: Number,
  apsCount: Number,
  aps: [{ ref: 'AccessPoint' }]
})

module.exports = mongoose.model('ReferencePoint', referencePointSchema)
