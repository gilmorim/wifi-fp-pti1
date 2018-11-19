const mongoose = require('mongoose')

const spaceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  description: String,
  additionDate: Date,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true },
  imageFile: {
    type: String,
    required: true
  },
  referencePoints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferencePoint' }]
})

module.exports = mongoose.model('Space', spaceSchema)
