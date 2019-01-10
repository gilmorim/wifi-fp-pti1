const express = require('express')
const router = express.Router()
const SpacesController = require('../controllers/spaces')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public')
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname)
  }
})

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true)
  } else {
    callback(null, false)
  }
}
const upload = multer({
  storage: storage,
  limits: {
    filesize: 1024 * 1024 * 10 // 10 Mb file size or less
  },
  fileFilter: fileFilter
})

router.get('/', /* checkAuth.requireOwner, */ SpacesController.spaces_get_all)

router.post('/', /* checkAuth.requireOwner, */ upload.single('imageFile'), SpacesController.spaces_add)

router.get('/:id', /* checkAuth.requireOwner, */ SpacesController.spaces_get_specific)

router.delete('/:id', /* checkAuth.requireAdmin, */ SpacesController.spaces_delete)

// check later
router.patch('/:id', /* checkAuth.requireAdmin, */ SpacesController.spaces_correct)

module.exports = router