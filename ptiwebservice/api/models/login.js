const mongoose = require('mongoose')

const loginSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: Date
})

module.exports = mongoose.model('Login', loginSchema)
