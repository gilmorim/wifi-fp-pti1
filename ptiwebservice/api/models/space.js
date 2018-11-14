const mongoose = require('mongoose')

const spaceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  additionDate: Date,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' },
  imageFile: String,
  referencesCount: Number,
  referencePoints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferencePoint' }]
})

module.exports = mongoose.model('Space', spaceSchema)
