
const express = require('express');
const router = express.Router();

//Import Controller
const UsersController = require('../../controllers/users');

router.post('/signup', UsersController.signup_user);

router.post('/login', UsersController.login_user)

router.delete('/:id', UsersController.delete_user)

module.exports = router;