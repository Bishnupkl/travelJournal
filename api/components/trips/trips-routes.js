const express = require('express');
const router = express.Router();
require('dotenv').config();

const tripController = require('./tripController');
const galleryRouter = require('./../gallery/gallery-routes')

router.route(process.env.EMPTY_URL)
.get(tripController.getAllTrips)
.post(tripController.createTrip)


router.route(process.env.URL_TRIPS_WITH_ID)
.get(tripController.findTripById)
.put(tripController.fullUpdateTripById) // Updated this line
.patch(tripController.partialUpdateTripById)  // Added PATCH route
.delete(tripController.deleteTripById);

//nested api
router.use(process.env.URL_TRIPS_WITH_ID, galleryRouter);

module.exports = router;

