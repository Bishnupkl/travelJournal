const mongoose = require('mongoose');
require('dotenv').config();

const TRIP_MODEL = process.env.TRIP_MODEL;
const Trip = mongoose.model(TRIP_MODEL);

const tripModelFindSkipLimitExec = function (query,offset, limit) {
    return Trip.find(query).skip(offset).limit(limit).exec();
};

const tripModelFindByIdExec = function (tripId) {
    return Trip.findById(tripId).exec();
};

const tripModelCreate = function (trip) {
    return Trip.create(trip);
};

const tripSave = function (trip) {
    return trip.save();
};

const tripModelFindByIdAndDeleteExec = function (tripId) {
    return Trip.findByIdAndDelete(tripId).exec();
};

const _setDefaultResponse = function (statusCode, data) {
    return {
        status: statusCode,
        data: data
    };
};

const _setErrorResponse = function (response, statusCode, message) {
    response.status = statusCode;
    response.data = message;
};

const _sendResponse = function (res, response) {
    res.status(parseInt(response.status)).json(response.data);
};

const _ifFoundAnyTrips = function (trips) {
    const error = {
        status: process.env.NOT_FOUND_CODE,
        message: process.env.NOT_FOUND_MESSAGE
    };
    return new Promise((resolve, reject) => {
        if (trips.length > 0) resolve(trips);
        else reject(error);
    });
};

const _ifFoundATrip = function (trip) {
    const error = {
        status: process.env.NOT_FOUND_CODE,
        message: process.env.NOT_FOUND_MESSAGE
    };
    return new Promise((resolve, reject) => {
        if (trip) resolve(trip);
        else reject(error);
    });
};

const _fullUpdate = function (req, trip) {
    trip.country = req.body.country;
    trip.airport = req.body.airport;
    trip.hotel = req.body.hotel;
    trip.gallery = req.body.gallery;
    return new Promise(resolve => resolve(trip));
};

const _partialUpdate = function (req, trip) {
    if (req.body && req.body.country) trip.country = req.body.country;
    if (req.body && req.body.airport) trip.airport = req.body.airport;
    if (req.body && req.body.hotel) trip.hotel = req.body.hotel;
    if (req.body && req.body.gallery) trip.gallery = req.body.gallery;
    return new Promise(resolve => resolve(trip));
};

const _updateTrip = function (req, res, updateCallback, statusCode) {
    let tripId = req.params.id;
    let response = _setDefaultResponse(statusCode, {});

    if (!mongoose.isValidObjectId(tripId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE);
        _sendResponse(res, response);
        return;
    }

    tripModelFindByIdExec(tripId)
        .then(trip => _ifFoundATrip(trip))
        .then(trip => updateCallback(req, trip))
        .then(trip => tripSave(trip))
        .then(trip => response.data = trip)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, {message: error.message}))
        .finally(() => _sendResponse(res, response));
};

const getAllTrips = function (req, res) {
    let offset = parseInt(req.query.offset) || process.env.OFFSET;
    let limit = parseInt(req.query.limit) || process.env.LIMIT;
    let response = _setDefaultResponse(process.env.GET_SUCCESS_CODE, []);
    let query = {};

    if (req.query && req.query.name) {
        query = { country: new RegExp(req.query.name, 'i') }
    }

    if (req.query && req.query.pageNumber) {
        if (isNaN(req.query.pageNumber) == true) {
            _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.OFFSET_COUNT_MUST_BE_NUMBER_MESSAGE)
        }
        else {
            pageNumber = parseInt(req.query.pageNumber);
        }
        if (pageNumber > 1) {
            offset = limit * (pageNumber - 1);
        }
    }



    tripModelFindSkipLimitExec(query,offset, limit)
        .then(trips => _ifFoundAnyTrips(trips))
        .then(trips => response.data = trips)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, {message: error.message}))
        .finally(() => _sendResponse(res, response));
};

const createTrip = function (req, res) {
    let trip = {
        country: req.body.country,
        airport: req.body.airport,
        hotel: req.body.hotel,
        gallery: req.body.gallery
    };
    let response = _setDefaultResponse(process.env.POST_SUCCESS_CODE, {});

    tripModelCreate(trip)
        .then(createdTrip => response.data = createdTrip)
        .catch(error => _setErrorResponse(response, process.env.BAD_REQUEST_CODE, {message: error.message}))
        .finally(() => _sendResponse(res, response));
};

const findTripById = function (req, res) {

    let tripId = req.params.id;
    let response = _setDefaultResponse(process.env.GET_SUCCESS_CODE, {});

    if (!mongoose.isValidObjectId(tripId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE);
        _sendResponse(res, response);
        return;
    }

    tripModelFindByIdExec(tripId)
        .then(trip => _ifFoundATrip(trip))
        .then(trip => response.data = trip)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, {message: error.message}))
        .finally(() => _sendResponse(res, response));
};

const deleteTripById = function (req, res) {
    let tripId = req.params.id;
    let response = _setDefaultResponse(process.env.DELETE_SUCCESS_CODE, {});

    if (!mongoose.isValidObjectId(tripId)) {
        _setErrorResponse(response, process.env.BAD_REQUEST_CODE, process.env.INVALID_TYPE_MESSAGE);
        _sendResponse(res, response);
        return;
    }

    tripModelFindByIdAndDeleteExec(tripId)
        .then(deletedTrip => _ifFoundATrip(deletedTrip))
        .then(deletedTrip => response.data = deletedTrip)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, {message: error.message}))
        .finally(() => _sendResponse(res, response));
};

const fullUpdateTripById = function (req, res) {
    _updateTrip(req, res, _fullUpdate, process.env.PUT_SUCCESS_CODE);
};

const partialUpdateTripById = function (req, res) {
    _updateTrip(req, res, _partialUpdate, process.env.PATCH_SUCCESS_CODE);
};

const tripModelFindAndCountExec = function (query) {
    return Trip.find(query).countDocuments();
}
const getTotalTripsCount = function (req, res) {
    let response = _setDefaultResponse(process.env.GET_SUCCESS_CODE, {})
    let query = {};
    if (req.query && req.query.name) {
        query = { country: new RegExp(req.query.name, 'i') }
    }

    tripModelFindAndCountExec(query)
        .then(totalTrips => response.data = totalTrips)
        .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, {message: error.message}))
        .finally(() => _sendResponse(res, response));
}

module.exports = {
    getAllTrips,
    createTrip,
    findTripById,
    deleteTripById,
    fullUpdateTripById,
    partialUpdateTripById,
    getTotalTripsCount
};
