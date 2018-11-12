const mongoose = require('mongoose')

const correctionEventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: Date,
  intensity: Number
})
module.exports = mongoose.model('CorrectionEvent', correctionEventSchema)
