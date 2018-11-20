const express = require('express')
const router = express.Router()
const SpacesController = require('../controllers/spaces')
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, SpacesController.spaces_get_all)

router.post('/', SpacesController.spaces_add)

router.get('/:id', SpacesController.spaces_get_specific)

router.delete('/', SpacesController.spaces_delete)

// check later
router.patch('/', SpacesController.spaces_correct)

module.exports = router
