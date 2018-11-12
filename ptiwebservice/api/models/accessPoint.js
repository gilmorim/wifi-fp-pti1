const mongoose = require('mongoose')

const accessPointSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  mac: String,
  intensity: Number
})

module.exports = mongoose.model('AccessPoint', accessPointSchema)
