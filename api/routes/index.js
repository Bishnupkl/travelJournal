const express = require('express');
const router = express.Router({ mergeParams: true });
const tripsRouter = require('./../components/trips/trips-routes')
const usersRouter = require('./../components/users/users-routes')


require('dotenv').config();

router.use(process.env.URL_TRIPS, tripsRouter)
router.use(process.env.URL_USERS, usersRouter)

module.exports = router;