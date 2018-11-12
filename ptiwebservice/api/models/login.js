const mongoose = require('mongoose')

const loginSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { ref: 'User' },
  date: Date
})

module.exports = mongoose.model('Login', loginSchema)
