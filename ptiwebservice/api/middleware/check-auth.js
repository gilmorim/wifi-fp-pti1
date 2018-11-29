const jwt = require('jsonwebtoken')

exports.requireOwner = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded
    console.log(req.userData)
    if (req.userData.rank.includes('owner') || req.userData.rank.includes('admin')) {
      next()
    } else {
      return res.status(401).json({
        message: 'You do not have permission for that'
      })
    }
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    })
  }
}

exports.requirePremium = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded
    // console.log(req.userData)
    if (req.userData.rank.includes('premium') || req.userData.rank.includes('admin')) {
      console.log('Access authorized')
      next()
    } else {
      console.log('Denied attempt')
      return res.status(401).json({
        message: 'You do not have permission for that'
      })
    }
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    })
  }
}

exports.requireAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded
    // console.log(req.userData)
    if (req.userData.rank.includes('admin')) {
      next()
    } else {
      return res.status(401).json({
        message: 'You do not have permission for that'
      })
    }
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed'
    })
  }
}
