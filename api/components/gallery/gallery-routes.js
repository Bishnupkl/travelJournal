const express = require('express');
const router = express.Router({ mergeParams: true });
const galleryController = require('./galleryController')

require('dotenv').config();

router.route(process.env.URL_GALLERY)
.get(galleryController.getTripGallerys)
.post(galleryController.addTripGallery);

router.route(process.env.URL_GALLERY_WITH_ID)
.get(galleryController.getTripGallery)
.put(galleryController.updateTripGallery)
.patch(galleryController.partialUpdateTripGallery)  // Added PATCH route
.delete(galleryController.deleteTripGallery);

module.exports = router;