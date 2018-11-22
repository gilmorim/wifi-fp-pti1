const express = require('express')
const router = express.Router()
const UsersController = require('../controllers/users')
const checkAuth = require('../middleware/check-auth')

// return all users
router.get('/', checkAuth.requireAdmin, UsersController.users_get_all)

// add new premium
router.post('/register', UsersController.users_register)

// get specific user
router.get('/:id', checkAuth.requireAdmin, UsersController.users_get_specific)

// delete a user
router.delete('/:id', checkAuth.requireAdmin, UsersController.users_delete)

// correct user
/*
  IMPORTANT:
  Object in request body must be an array such as:
    [
      {"propName": "name of the Property", "value": "Value of the property"}
    ]

   EXAMPLE - change user email and password
    [
      {"propName":"email", "value":"newEmail@test.com"},
      {"propName":"password", "value":"hunter3"}
    ]
 */
router.patch('/:id', UsersController.users_correct)

// handle login here
router.post('/login', UsersController.users_login)

module.exports = router
