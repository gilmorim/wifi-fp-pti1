const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  email: String,
  rank: String,
  username: String,
  cardNumber: String,
  cvv: String,
  cardExpiration: String,
  registrationDate: String
})

module.exports = mongoose.model('User', userSchema)
