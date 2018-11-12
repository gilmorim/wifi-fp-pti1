const mongoose = require('mongoose')

const spaceSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  description: String,
  additionDate: Date,
  owner: { ref: 'User' },
  imageFile: String,
  referencesCount: Number,
  referencePoints: [{ ref: 'ReferencePoint' }]
})

module.exports = mongoose.model('Space', spaceSchema)
