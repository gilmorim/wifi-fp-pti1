const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// routes middlewares
const locationRoutes = require('./api/routes/location')
const spacesRoutes = require('./api/routes/spaces')
const usersRoutes = require('./api/routes/users')
const referencepointsRoutes = require('./api/routes/referencepoints')

mongoose.connect('mongodb+srv://gilgm:' + process.env.MONGO_ATLAS_PW + '@wifi-fingerprint-pti-l4gos.mongodb.net/', {
  useNewUrlParser: true,
  dbName: 'fingerprintdb'
})
  .then(res => console.log('Connected to database'))
  .catch(err => console.log('error connecting -> ' + err))

mongoose.Promise = global.Promise

// logging tool
app.use(morgan('dev'))

// CORS errors
app.use((res, req, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

// parse urls
app.use(bodyParser.urlencoded(({
  extended: true,
  limit: '50mb'
})))

// parse json objects
app.use(bodyParser.json({
  limit: '50mb'
}))
app.use('/public', express.static('public'))
app.use('/location', locationRoutes)
app.use('/spaces', spacesRoutes)
app.use('/users', usersRoutes)
app.use('/referencepoints', referencepointsRoutes)

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
