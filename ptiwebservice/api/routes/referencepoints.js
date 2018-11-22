const express = require('express')
const router = express.Router()
const ReferencePoints = require('../controllers/referencepoints')
const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth.requireAdmin, ReferencePoints.referencepoints_get_all)

router.post('/', checkAuth.requireOwner, ReferencePoints.referencepoints_add)

router.get('/:id', checkAuth.requireOwner, ReferencePoints.referencepoints_get_specific)

router.delete('/:id', checkAuth.requireAdmin, ReferencePoints.referencepoints_delete)

router.patch('/:id', checkAuth.requireOwner, ReferencePoints.referencepoints_correct)

module.exports = router
