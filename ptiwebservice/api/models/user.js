const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: String,
  rank: String,
  username: String,
  password: String,
  cardNumber: String,
  cvv: String,
  cardExpiration: String,
  registrationDate: String
})

module.exports = mongoose.model('User', userSchema)
