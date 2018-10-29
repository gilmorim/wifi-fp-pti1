const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// routes middlewares
const locationRoutes = require('./api/routes/location')
const spacesRoutes = require('./api/routes/spaces')
const usersRoutes = require('./api/routes/users')
mongoose.connect('mongodb+srv://gilgm:' +
  process.env.MONGO_ATLAS_PW +
  '@wifi-fingerprint-pti-l4gos.mongodb.net/test?retryWrites=true', {
  useMongoClient: true
})

// logging tool
app.use(morgan('dev'))

// parse urls
app.use(bodyParser.urlencoded(({
  extended: false
})))

// parse json objects
app.use(bodyParser.json())

// CORS errors
app.use((res, req, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    return res.status(200).json({})
  }
})

app.use('/location', locationRoutes)
app.use('/spaces', spacesRoutes)
app.use('/users', usersRoutes)

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
