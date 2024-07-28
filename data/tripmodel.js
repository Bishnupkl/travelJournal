const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Gallery Schema
const gallerySchema = new Schema({
  place: { type: String, required: true },
  picture: String // Array of picture URLs
});

// Trip Schema
const tripSchema = new Schema({
  country: { type: String, required: true },
  airport: { type: String, required: true },
  hotel: { type: String, required: true },
  gallery: [gallerySchema] // Array of gallery documents
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
