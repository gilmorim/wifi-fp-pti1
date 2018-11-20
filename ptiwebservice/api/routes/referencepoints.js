const express = require('express')
const router = express.Router()
const ReferencePoints = require('../controllers/referencepoints')

router.get('/', ReferencePoints.referencepoints_get_all)

router.post('/', ReferencePoints.referencepoints_add)

router.get('/:id', ReferencePoints.referencepoints_get_specific)

router.delete('/:id', ReferencePoints.referencepoints_delete)

router.patch('/:id', ReferencePoints.referencepoints_correct)

module.exports = router
