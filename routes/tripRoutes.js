
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const galleryController = require('../controllers/galleryController');

router.route('')
    .get(tripController.getAllTrips)
    .post(tripController.createTrip);

router.route('/:id')
    .get(tripController.getOneTrip)
    .put(tripController.updateTrip) // Updated this line
    .patch(tripController.partialUpdateTrip)  // Added PATCH route
    .delete(tripController.deleteTrip);

router.route('/:id/gallery')
    .get(galleryController.getTripGallerys)
    .post(galleryController.addTripGallery);

router.route('/:tripId/gallery/:galleryID')
    .get(galleryController.getTripGallery)
    .put(galleryController.updateTripGallery)
    .patch(galleryController.partialUpdateTripGallery)  // Added PATCH route
    .delete(galleryController.deleteTripGallery);

module.exports = router;
