const mongoose = require('mongoose')

const locationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  aps: [{ mac: String, intensity: Number }],
  date: Date
})

module.exports = mongoose.model('Location', locationSchema)
