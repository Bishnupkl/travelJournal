

const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getOneTrip);
router.post('/', tripController.createTrip);
router.delete('/:id', tripController.deleteTrip);
router.get('/:id/gallery', tripController.getTripGallery);
router.post('/:id/gallery', tripController.addGalleryEntry);
router.get('/:tripId/gallery/:entryId', tripController.getGalleryEntry);
router.put('/:tripId/gallery/:entryId', tripController.updateGalleryEntry);
router.delete('/:tripId/gallery/:entryId', tripController.deleteGalleryEntry);

module.exports = router;
