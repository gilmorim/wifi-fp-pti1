const mongoose = require('mongoose')

const locationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Space'
  },
  aps: {
    type: [{ mac: String, intensity: Number }],
    required: true
  },
  date: Date
})

module.exports = mongoose.model('Location', locationSchema)