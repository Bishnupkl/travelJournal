
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
        const findTripsWithCallback = callbackify(function () {
            return Trip.find().skip(offset).limit(limit).exec();
        });
        findTripsWithCallback(function (error, trips) {
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
    const findTripByIdWithCallback = callbackify(function () {
        return Trip.findById(id).exec();
    });
    findTripByIdWithCallback(function (error, trip) {
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
    const createTripWithCallback = callbackify(function () {
        return Trip.create(newTrip);
    });
    createTripWithCallback(function (error, response) {
        if (error)
            res.status(500).json({ message: error.message });
        else
            res.status(201).json(response);
    });
}

// Delete a trip by ID
const deleteTrip = function (req, res) {
    let id = req.params.id;
    const deleteTripByIdWithCallback = callbackify(function () {
        return Trip.findByIdAndDelete(id).exec();
    });
    deleteTripByIdWithCallback(function (error, response) {
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
    const updateTripByIdWithCallback = callbackify(function () {
        return Trip.findByIdAndUpdate(id, updatedTrip, { new: true }).exec();
    });
    updateTripByIdWithCallback(function (error, trip) {
        if (error)
            res.status(400).json({ message: error.message });
        else if (trip) {
            res.status(200).json(trip);
        } else {
            res.status(400).json({ message: 'trip not found' });
        }
    });
}

// Partial Update trip by ID
const partialUpdateTrip = function (req, res) {
    let id = req.params.id;
    const patchTripByIdWithCallback = callbackify(function() {
        return Trip.findByIdAndUpdate(id, { $set: req.body }, { new: true }).exec();
    });
    patchTripByIdWithCallback(function(error, trip) {
        if (error)
            res.status(400).json({ message: error.message });
        else if (trip) {
            res.status(200).json(trip);
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
    partialUpdateTrip,
};
