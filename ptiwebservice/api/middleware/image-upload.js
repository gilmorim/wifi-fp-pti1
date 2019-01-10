const multer = require('multer')

function ImageUploader (req, res, next) {
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
  return upload
}

module.exports = ImageUploader
