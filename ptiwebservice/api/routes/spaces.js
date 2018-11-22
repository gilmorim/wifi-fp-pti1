const express = require('express')
const router = express.Router()
const SpacesController = require('../controllers/spaces')
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth.requireOwner, SpacesController.spaces_get_all)

router.post('/', checkAuth.requireOwner, SpacesController.spaces_add)

router.get('/:id', checkAuth.requireOwner, SpacesController.spaces_get_specific)

router.delete('/', checkAuth.requireAdmin, SpacesController.spaces_delete)

// check later
router.patch('/', checkAuth.requireAdmin, SpacesController.spaces_correct)

module.exports = router
