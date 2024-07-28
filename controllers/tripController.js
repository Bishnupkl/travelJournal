
const mongoose = require('mongoose');
const util = require('util');
const Trip = mongoose.model('Trip');
const callbackify = util.callbackify;

// Get all trips with pagination
const getAllTrips = function (req, res) {
    const decimal = 10;
    let offset = 0;
    let limit = 7;

    if (req.query && req.query.offset && isNaN(req.query.offset) === true && req.query.limit && isNaN(req.query.limit) === true) {
        res.status(400).json({ message: 'offset and limit must be a number' });
        return;
    }

    if (req.query && req.query.offset) {
        if (isNaN(req.query.offset) === true) {
            res.status(400).json({ message: 'offset must be a number' });
            return;
        }
        offset = parseInt(req.query.offset, decimal);
    }
    if (req.query && req.query.limit) {
        if (isNaN(req.query.limit) === true) {
            res.status(400).json({ message: 'limit must be a number and less than 7' });
            return;
        }
        limit = parseInt(req.query.limit, decimal);
    }
    if (limit > 7) {
        res.status(400).json({ message: 'limit could not be more than 7' });
        return;
    } else {
        const findTripsWithCallback = callbackify(function() {
            return Trip.find().skip(offset).limit(limit).exec();
        });
        findTripsWithCallback(function(error, trips) {
            if (error)
                res.status(500).json({ message: error.message });
            else
                res.status(200).json(trips);
        });
    }
}

// Get one trip by ID
const getOneTrip = function (req, res) {
    let id = req.params.id;
    const findTripByIdWithCallback = callbackify(function() {
        return Trip.findById(id).exec();
    });
    findTripByIdWithCallback(function(error, trip) {
        if (error)
            res.status(400).json({ message: error.message });
        else if (trip) {
            res.status(200).json(trip);
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}

// Create a new trip
const createTrip = function (req, res) {
    const newTrip = {
        country: req.body.country,
        airport: req.body.airport,
        hotel: req.body.hotel,
        gallery: req.body.gallery
    };
    const createTripWithCallback = callbackify(function() {
        return Trip.create(newTrip);
    });
    createTripWithCallback(function(error, response) {
        if (error)
            res.status(500).json({ message: error.message });
        else
            res.status(201).json(response);
    });
}

// Delete a trip by ID
const deleteTrip = function (req, res) {
    let id = req.params.id;
    const deleteTripByIdWithCallback = callbackify(function() {
        return Trip.findByIdAndDelete(id).exec();
    });
    deleteTripByIdWithCallback(function(error, response) {
        if (error)
            res.status(400).json({ message: error.message });
        else if (response) {
            res.status(200).json(response);
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}


// Update a trip by ID
const updateTrip = function (req, res) {
    let id = req.params.id;
    const updatedTrip = {
        country: req.body.country,
        airport: req.body.airport,
        hotel: req.body.hotel,
        gallery: req.body.gallery
    };
    const updateTripByIdWithCallback = callbackify(function() {
        return Trip.findByIdAndUpdate(id, updatedTrip, { new: true }).exec();
    });
    updateTripByIdWithCallback(function(error, trip) {
        if (error)
            res.status(400).json({ message: error.message });
        else if (trip) {
            res.status(200).json(trip);
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}

// Get gallery for a particular trip by ID
const getTripGallery = function (req, res) {
    let id = req.params.id;
    const findTripGalleryWithCallback = callbackify(function() {
        return Trip.findById(id).select('gallery').exec();
    });
    findTripGalleryWithCallback(function(error, trip) {
        if (error)
            res.status(400).json({ message: error.message });
        else if (trip) {
            res.status(200).json(trip.gallery);
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}

// Add a gallery entry to a particular trip
const addGalleryEntry = function (req, res) {
    let id = req.params.id;
    const newGalleryEntry = {
        place: req.body.place,
        photo: req.body.photo
    };
    const findTripByIdWithCallback = callbackify(function() {
        return Trip.findById(id).exec();
    });
    findTripByIdWithCallback(function(error, trip) {
        if (error) {
            res.status(400).json({ message: error.message });
        } else if (trip) {
            trip.gallery.push(newGalleryEntry);
            trip.save(function(saveError, savedTrip) {
                if (saveError) {
                    res.status(500).json({ message: saveError.message });
                } else {
                    res.status(201).json(savedTrip.gallery);
                }
            });
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}

// Get a gallery entry by trip ID and entry ID
const getGalleryEntry = function (req, res) {
    let tripId = req.params.tripId;
    let entryId = req.params.entryId;
    const findTripGalleryWithCallback = callbackify(function() {
        return Trip.findById(tripId).select('gallery').exec();
    });
    findTripGalleryWithCallback(function(error, trip) {
        if (error) {
            res.status(400).json({ message: error.message });
        } else if (trip) {
            const galleryEntry = trip.gallery.id(entryId);
            if (galleryEntry) {
                res.status(200).json(galleryEntry);
            } else {
                res.status(400).json({ message: 'gallery entry not found' });
            }
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}

// Update a gallery entry by trip ID and entry ID
const updateGalleryEntry = function (req, res) {
    let tripId = req.params.tripId;
    let entryId = req.params.entryId;
    const findTripByIdWithCallback = callbackify(function() {
        return Trip.findById(tripId).exec();
    });
    findTripByIdWithCallback(function(error, trip) {
        if (error) {
            res.status(400).json({ message: error.message });
        } else if (trip) {
            const galleryEntry = trip.gallery.id(entryId);
            if (galleryEntry) {
                galleryEntry.place = req.body.place || galleryEntry.place;
                galleryEntry.photo = req.body.photo || galleryEntry.photo;
                trip.save(function(saveError, savedTrip) {
                    if (saveError) {
                        res.status(500).json({ message: saveError.message });
                    } else {
                        res.status(200).json(galleryEntry);
                    }
                });
            } else {
                res.status(400).json({ message: 'gallery entry not found' });
            }
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}

// Delete a gallery entry by trip ID and entry ID
const deleteGalleryEntry = function (req, res) {
    let tripId = req.params.tripId;
    let entryId = req.params.entryId;
    const findTripByIdWithCallback = callbackify(function() {
        return Trip.findById(tripId).exec();
    });
    findTripByIdWithCallback(function(error, trip) {
        if (error) {
            res.status(400).json({ message: error.message });
        } else if (trip) {
            const galleryEntry = trip.gallery.id(entryId);
            if (galleryEntry) {
                galleryEntry.remove();
                trip.save(function(saveError, savedTrip) {
                    if (saveError) {
                        res.status(500).json({ message: saveError.message });
                    } else {
                        res.status(200).json({ message: 'gallery entry deleted' });
                    }
                });
            } else {
                res.status(400).json({ message: 'gallery entry not found' });
            }
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}

module.exports = {
    getAllTrips,
    getOneTrip,
    createTrip,
    deleteTrip,
    updateTrip,
    getTripGallery,
    addGalleryEntry,
    getGalleryEntry,
    updateGalleryEntry,
    deleteGalleryEntry
};
