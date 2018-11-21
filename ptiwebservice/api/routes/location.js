const express = require('express')
const router = express.Router()
const LocationController = require('../controllers/location')

// User gives info of his wifi fingerprint, and is given his geographical position
router.post('/', LocationController.location_fingerprint)

router.get('/:id', LocationController.location_get_specific)

// Premium user can correct his position - WIP
router.post('/correction', LocationController.location_correction)

module.exports = router
