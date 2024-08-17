const express = require('express');
const router = express.Router({ mergeParams: true });
const galleryController = require('./galleryController')
const authController = require('./../authentication/authController');


require('dotenv').config();

router.route(process.env.URL_GALLERY)
.get(galleryController.getTripGallerys)
.post(authController.isValidToken,galleryController.addTripGallery);

router.route(process.env.URL_GALLERY_WITH_ID)
.get(galleryController.getTripGallery)
.put(authController.isValidToken,galleryController.updateTripGallery)
.patch(authController.isValidToken,galleryController.partialUpdateTripGallery)  // Added PATCH route
.delete(authController.isValidToken,galleryController.deleteTripGallery);

module.exports = router;