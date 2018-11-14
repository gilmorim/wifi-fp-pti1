const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true
  },
  rank: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  cvv: {
    type: Number,
    required: true
  },
  cardExpiration: {
    type: String,
    required: true
  },
  registrationDate: Date
})

module.exports = mongoose.model('User', userSchema)
