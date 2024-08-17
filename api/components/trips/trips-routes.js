const express = require('express');
const router = express.Router();
require('dotenv').config();

const tripController = require('./tripController');
const authController = require('./../authentication/authController');
const galleryRouter = require('./../gallery/gallery-routes')

router.route(process.env.EMPTY_URL)
.get(tripController.getAllTrips)
.post(tripController.createTrip)

router.route(process.env.URL_TOTAL_COLLECTION)
    .get(tripController.getTotalTripsCount)


router.route(process.env.URL_TRIPS_WITH_ID)
.get(tripController.findTripById)
.put(authController.isValidToken,tripController.fullUpdateTripById) // Updated this line
.patch(authController.isValidToken,tripController.partialUpdateTripById)  // Added PATCH route
.delete(authController.isValidToken,tripController.deleteTripById);

//nested api
router.use(process.env.URL_TRIPS_WITH_ID, galleryRouter);

module.exports = router;

