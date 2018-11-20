const express = require('express')
const router = express.Router()
const Location = require('../controllers/location')

// User gives info of his wifi fingerprint, and is given his geographical position
router.post('/', Location.location_fingerprint)

router.get('/:id', Location.location_get_specific)

// Premium user can correct his position - WIP
router.post('/correction', Location.location_correction)

module.exports = router
