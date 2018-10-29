const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'a GET on this route should query the database for the users list'
  })
})

router.post('/', (req, res, next) => {
  res.status(200).json({
    message: 'a POST on this route should add a new user'
  })
})

router.get('/:id', (req, res, next) => {
  res.status(200).json({
    message: 'a GET on this route should give info on the requested user id'
  })
})

router.delete('/', (req, res, next) => {
  res.status(200).json({
    message: 'a DELETE on this route should delete this user from the database'
  })
})
module.exports = router
