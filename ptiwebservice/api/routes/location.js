const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'a GET on this route should query the database for the users last recorded position'
  })
})

router.post('/', (req, res, next) => {
  // response format
  res.status(200).json({
    'name': 'test'
  })
})

router.post('/correct', (req, res, next) => {
  res.status(200).json({
    message: 'a POST on this route should correct the users location on the database'
  })
})

module.exports = router
