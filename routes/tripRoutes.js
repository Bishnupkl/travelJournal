const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const galleryController = require('../controllers/galleryController');

router.route('')
    .get(tripController.getAllTrips)
    .post(tripController.createTrip);


router.route('/:id')
    .get(tripController.findTripById)
    .put(tripController.fullUpdateTripById) // Updated this line
    .patch(tripController.partialUpdateTripById)  // Added PATCH route
    .delete(tripController.deleteTripById);

router.route(`/:id/${process.env.URL_GALLERY}`) 
    .get(galleryController.getTripGallerys)
    .post(galleryController.addTripGallery);

router.route(`/:tripId/${process.env.URL_GALLERY_WITH_ID}`)
    .get(galleryController.getTripGallery)
    .put(galleryController.updateTripGallery)
    .patch(galleryController.partialUpdateTripGallery)  // Added PATCH route
    .delete(galleryController.deleteTripGallery);

module.exports = router;
