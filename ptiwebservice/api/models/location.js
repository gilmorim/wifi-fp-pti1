const mongoose = require('mongoose')

const locationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  aps: {
    type: [{ mac: String, intensity: Number }],
    required: true
  },
  date: Date
})

module.exports = mongoose.model('Location', locationSchema)
