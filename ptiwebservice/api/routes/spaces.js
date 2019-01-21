const express = require('express')
const mongoose = require('mongoose')
const Space = require('../models/space')
const router = express.Router()
const SpacesController = require('../controllers/spaces')
const checkAuth = require('../middleware/check-auth')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public')
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname)
  }
})

/* const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true)
  } else {
    callback(null, false)
  }
} */

const upload = multer({
  storage: storage,
  limits: {
    filesize: 1024 * 1024 * 10 // 10 Mb file size or less
  }/*,
  fileFilter: fileFilter */
})

router.get('/', checkAuth.requireOwner, SpacesController.spaces_get_all)

router.post('/', checkAuth.requireOwner, upload.single('imageFile'), (req, res, next) => {
  const space = new Space({
    _id: new mongoose.Types.ObjectId(),
    additionDate: Date.now(),
    name: req.body.name,
    description: req.body.description,
    owner: req.body.owner,
    imageFile: req.file.path,
    referencePoints: req.body.referencePoints
  })

  space
    .save()
    .then(result => {
      /* res.status(201).json({
        message: 'Created space successfully',
        createdSpace: {
          _id: result.id,
          name: result.name,
          request: {
            description: 'To get more details about space ' + result.name,
            type: 'GET',
            url: 'http://' + process.env.AWS_URL + ':' + process.env.PORT + '/spaces/' + result._id
          }
        }
      }) */

      res.status(201).send(result.id)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err,
        message: 'Could not add space'
      })
    })
})

router.get('/:id', /* checkAuth.requireOwner, */ SpacesController.spaces_get_specific)

router.delete('/:id', /* checkAuth.requireAdmin, */ SpacesController.spaces_delete)

// check later
router.patch('/:id', /* checkAuth.requireAdmin, */ SpacesController.spaces_correct)

module.exports = router
