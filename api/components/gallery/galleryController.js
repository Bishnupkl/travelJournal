const mongoose = require('mongoose');
require('dotenv').config();

const TRIP_MODEL = process.env.TRIP_MODEL;
const Trip = mongoose.model(TRIP_MODEL);

const _findTripById = function (id) {
    console.log(id);
    
    return Trip.findById(id).exec();
}

const _saveTrip = function (trip) {
    return trip.save();
}

const _getIfFoundTrip = function (trip) {
    const error = {
        status: process.env.NOT_FOUND_CODE,
        message: process.env.NOT_FOUND_MESSAGE
    }
    return new Promise((resolve, reject) => {
        if (trip) resolve(trip);
        else reject(error);
    });
}

const _getIfFoundGallery = function (gallery) {
    const error = {
        status: process.env.NOT_FOUND_CODE,
        message: process.env.NOT_FOUND_MESSAGE
    }
    return new Promise((resolve, reject) => {
        if (gallery) resolve(gallery);
        else reject(error);
    });
}

const _setDefaultResponse = function (statusCode, data) {
    return { status: statusCode, data };
}

const _setErrorResponse = function (response, statusCode, message) {
    response.status = statusCode;
    response.data = message;
}

const _sendResponse = function (res, response) {
    console.log(response);
    res.status(parseInt(response.status)).json(response.data);
}

const _createNewGalleryObject = function (req) {
    return {
        place: req.body.place,
        picture: req.body.picture
    };
}

const _addGalleryToTrip = function (trip, gallery) {
    return new Promise(resolve => {
        trip.gallery.push(gallery);
        resolve(trip);
    });
}

const _deleteGalleryFromTrip = function (trip, galleryId) {
    return new Promise(resolve => {
        trip.gallery.pull(galleryId);
        resolve(trip);
    });
}

const _updateGallery = function (trip, gallery, req) {
    if (req.body.place) gallery.place = req.body.place;
    if (req.body.picture) gallery.picture = req.body.picture;
    return new Promise(resolve => {
        resolve(trip);
    });
}

const _updateTrip = function (req, res, callback, STATUS_CODE) {
    const tripId = req.params.id;
    const galleryId = req.params.galleryID;
    let response = _setDefaultResponse(STATUS_CODE, {});
    
    if (!mongoose.isValidObjectId(tripId) || !mongoose.isValidObjectId(galleryId)) {
        response.status = process.env.BAD_REQUEST_CODE;
        response.data = { message: process.env.INVALID_TYPE_MESSAGE };
        return _sendResponse(res, response);
    }
    
    _findTripById(tripId)
    .then(trip => _getIfFoundTrip(trip))
    .then(trip => callback(trip, trip.gallery.id(galleryId), req))
    .then(trip => _saveTrip(trip))
    .then(trip => response.data = trip)
    .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
    .finally(() => _sendResponse(res, response));
}

const getTripGallerys = function (req, res) {
    
    const tripId = req.params.id;
    let response = _setDefaultResponse(process.env.GET_SUCCESS_CODE, {});
    
    if (!mongoose.isValidObjectId(tripId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE);
        return _sendResponse(res, response);
    }
    
    _findTripById(tripId)
    .then(trip => _getIfFoundTrip(trip))
    .then(trip => response.data = trip.gallery)
    .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
    .finally(() => _sendResponse(res, response));
}

const addTripGallery = function (req, res) {
    const tripId = req.params.id;
    const newGallery = _createNewGalleryObject(req);
    let response = _setDefaultResponse(process.env.POST_CODE, {});
    
    if (!mongoose.isValidObjectId(tripId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE);
        return _sendResponse(res, response);
    }
    
    _findTripById(tripId)
    .then(trip => _getIfFoundTrip(trip))
    .then(trip => _addGalleryToTrip(trip, newGallery))
    .then(trip => _saveTrip(trip))
    .then(trip => response.data = trip.gallery[trip.gallery.length - 1])
    .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
    .finally(() => _sendResponse(res, response));
}

const getTripGallery = function (req, res) {
    const tripId = req.params.id;
    const galleryId = req.params.galleryID;
    console.log(tripId);
    console.log(galleryId);
    
    let response = _setDefaultResponse(process.env.GET_SUCCESS_CODE, {});
    
    if (!mongoose.isValidObjectId(tripId) || !mongoose.isValidObjectId(galleryId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE);
        return _sendResponse(res, response);
    }
    
    _findTripById(tripId)
    .then(trip => _getIfFoundTrip(trip))
    .then(trip => _getIfFoundGallery(trip.gallery.id(galleryId)))
    .then(gallery => response.data = gallery)
    .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
    .finally(() => _sendResponse(res, response));
}

const updateTripGallery = function (req, res) {
    _updateTrip(req, res, _updateGallery, process.env.PUT_CODE);
}

const partialUpdateTripGallery = function (req, res) {
    _updateTrip(req, res, _updateGallery, process.env.PUT_CODE);
}

const deleteTripGallery = function (req, res) {
    const tripId = req.params.id;
    const galleryId = req.params.galleryID;
    let response = _setDefaultResponse(process.env.DELETE_CODE, {});
    
    if (!mongoose.isValidObjectId(tripId) || !mongoose.isValidObjectId(galleryId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE);
        return _sendResponse(res, response);
    }
    
    _findTripById(tripId)
    .then(trip => _getIfFoundTrip(trip))
    .then(trip => _deleteGalleryFromTrip(trip, galleryId))
    .then(trip => _saveTrip(trip))
    .then(() => response.data = { message: 'Trip Gallery deleted' })
    .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, { message: error.message }))
    .finally(() => _sendResponse(res, response));
}

module.exports = {
    getTripGallerys,
    addTripGallery,
    getTripGallery,
    updateTripGallery,
    partialUpdateTripGallery,
    deleteTripGallery
};
