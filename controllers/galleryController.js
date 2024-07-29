const mongoose = require('mongoose');
const util = require('util');
const Trip = mongoose.model('Trip');
const callbackify = util.callbackify;


// Get gallery for a particular trip by ID
const getTripGallerys = function (req, res) {
    let id = req.params.id;
    const findTripGalleryWithCallback = callbackify(function () {
        return Trip.findById(id).select('gallery').exec();
    });
    findTripGalleryWithCallback(function (error, trip) {
        if (error)
            res.status(400).json({ message: error.message });
        else if (trip) {
            res.status(200).json(trip.gallery);
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}

// Add a gallery  to a particular trip
const addTripGallery = function (req, res) {
    let tripId = req.params.id;
    const newTripGallery = {
        place: req.body.place,
        picture: req.body.picture
    };

    const addTripGalleryWithCallback = callbackify(function() {
        return Trip.findById(tripId).exec();
    });

    addTripGalleryWithCallback(function(error, trip) {
        if (error) {
            res.status(400).json({ message: error.message });
        } else if (trip) {
            trip.gallery.push(newTripGallery);
            const saveTripWithCallback = callbackify(function() {
                return trip.save();
            });

            saveTripWithCallback(function(saveError, updatedTrip) {
                if (saveError) {
                    res.status(500).json({ message: saveError.message });
                } else {
                    res.status(201).json(updatedTrip.gallery[updatedTrip.gallery.length - 1]);
                }
            });
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    });
}

// Get a gallery  by trip ID and gallery ID
const getTripGallery = function (req, res) {
    let tripId = req.params.tripId;
    let galleryID = req.params.galleryID;
    const findTripGalleryWithCallback = callbackify(function () {
        return Trip.findById(tripId).select('gallery').exec();
    });
    findTripGalleryWithCallback(function (error, trip) {
        if (error) {
            res.status(400).json({ message: error.message });
        } else if (trip) {
            const Tripgallery = trip.gallery.id(galleryID);
            if (Tripgallery) {
                res.status(200).json(Tripgallery);
            } else {
                res.status(400).json({ message: 'Trip gallery  not found' });
            }
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}

// Update a gallery  by trip ID and gallery ID
const updateTripGallery = function (req, res) {
    let tripId = req.params.tripId;
    let galleryID = req.params.galleryID;
    const updatedTripGallery = {
        'gallery.$.place': req.body.place,
        'gallery.$.photo': req.body.photo
    };

    const updateTripGalleryWithCallback = callbackify(function() {
        return Trip.findOneAndUpdate(
            { _id: tripId, 'gallery._id': galleryID },
            { $set: updatedTripGallery },
            { new: true }
        ).exec();
    });

    updateTripGalleryWithCallback(function(error, trip) {
        if (error) {
            res.status(400).json({ message: error.message });
        } else if (trip) {
            const updatedEntry = trip.gallery.id(galleryID);
            if (updatedEntry) {
                res.status(200).json(updatedEntry);
            } else {
                res.status(404).json({ message: 'Trip Gallery  not found' });
            }
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    });
}

// Partial update by trip ID and gallery ID 
const partialUpdateTripGallery = function (req, res) {
    let tripId = req.params.tripId;
    let entryId = req.params.galleryID;

    const updateFields = {};
    if (req.body.place) updateFields['gallery.$.place'] = req.body.place;
    if (req.body.picture) updateFields['gallery.$.photo'] = req.body.photo;
    
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: 'No valid fields to update' });
    }


    const patchTripGalleryWithCallback = callbackify(function() {
        return Trip.findOneAndUpdate(
            { _id: tripId, 'gallery._id': entryId },
            { $set: updateFields },
            { new: true }
        ).exec();
    });
    
    patchTripGalleryWithCallback(function(error, trip) {
        if (error) {
            res.status(400).json({ message: error.message });
        } else if (trip) {
            const updatedTripGallery = trip.gallery.id(entryId);
            if (updatedTripGallery) {
                res.status(200).json(updatedTripGallery);
            } else {
                res.status(404).json({ message: 'Trip Gallery  not found' });
            }
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    });
}

// Delete a gallery  by trip ID and entry ID
const deleteTripGallery = function (req, res) {
    let tripId = req.params.tripId;
    let galleryID = req.params.galleryID;
    const deleteTripGalleryWithCallback = callbackify(function() {
        return Trip.findByIdAndUpdate(
            tripId,
            { $pull: { gallery: { _id: galleryID } } },
            { new: true }
        ).exec();
    });

    deleteTripGalleryWithCallback(function(error, trip) {
        if (error) {
            res.status(400).json({ message: error.message });
        } else if (trip) {
            res.status(200).json({ message: 'Trip Gallery deleted' });
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    });
}

module.exports = {
    getTripGallerys,
    addTripGallery,
    getTripGallery,
    updateTripGallery,
    partialUpdateTripGallery,
    deleteTripGallery
};
