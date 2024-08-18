const express = require('express');
const router = express.Router();
require('dotenv').config();
const userController = require('./userController');
const authController = require('./../authentication/authController')

router.route(process.env.EMPTY_URL)
    .get(userController.getUsers)
    .post(userController.createUser)

router.route(process.env.URL_USERS_LOGIN)
    .post(authController.login)

module.exports = router;