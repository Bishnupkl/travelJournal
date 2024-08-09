require('dotenv').config();
const { response } = require('express');
const mongoose = require('mongoose');
const { resolve } = require('path');
const Trip = mongoose.model(process.env.TRIP_MODEL);
const { callbackify } = require('util');

const tripModelFindSkipLimitExecCallback = callbackify(function (offset, limit) {
    return Trip.find().skip(offset).limit(limit).exec();
});

const tripModelCreateCallback = callbackify(function (trip) {
    return Trip.create(trip);
});

const tripModelFindByIdExecCallback = callbackify(function (tripId) {
    return Trip.findById(tripId).exec();
});

const tripModelFindByIdAndDeleteExecCallback = callbackify(function (tripId) {
    return Trip.findByIdAndDelete(tripId).exec();
});

const tripSaveCallback = callbackify(function (trip) {
    return trip.save();
});

const _fullUpdate = function (req, trip) {
    trip.country = req.body.country;
    trip.airport = req.body.airport;
    trip.hotel = req.body.hotel;
    trip.gallery = req.body.gallery;
};

const _partialUpdate = function (req, trip) {
    if (req.body && req.body.country) trip.country = req.body.country;
    if (req.body && req.body.airport) trip.airport = req.body.airport;
    if (req.body && req.body.hotel) trip.hotel = req.body.hotel;
    if (req.body && req.body.gallery) trip.gallery = req.body.gallery;
};

const _updateTrip = function (req, res, updateCallback) {
    let tripId = req.params.id;
    
    let response = {
        status: process.env.GET_SUCCESS_CODE,
        json: []
    };
    
    if (!mongoose.isValidObjectId(tripId)) {
        response.status = process.env.NOT_FOUND_CODE;
        response.json = { message: process.env.CODE_400_MESSAGE };
        res.status(response.status).json(response.json);
        return;
    }
    
    tripModelFindByIdExecCallback(tripId, function (err, trip) {
        if (err) {
            response.status = process.env.SOMETHING_WRONG;
            response.json = { message: err.message };
            res.status(response.status).json(response.json);
        } else if (!trip) {
            response.status = process.env.NOT_FOUND_CODE;
            response.json = { message: process.env.CODE_404_MESSAGE };
            res.status(response.status).json(response.json);
        } else {
            updateCallback(req, trip);
            tripSaveCallback(trip, function (err, updatedTrip) {
                if (err) {
                    response.status = process.env.SOMETHING_WRONG;
                    response.json = { message: err.message };
                } else {
                    response.status = process.env.PATCH_SUCCESS_CODE;
                    response.json = updatedTrip;
                }
                res.status(response.status).json(response.json);
            });
        }
    });
};

const getAllTrips = function (req, res) {
    console.log("get all controller");
    
    let response = {
        status: 200,
        json: []
    };
    
    let offset = 0;
    let limit = 5;
    let pageNumber = req.query.pageNumber;
    
    if (req.query) {
        if (req.query.offset && isNaN(req.query.offset)) {
            response.status = process.env.CODE_400_MESSAGE;
            response.json = { message: 'offset must be a number' };
        } else if (req.query.limit && isNaN(req.query.limit)) {
            response.status = process.env.CODE_400_MESSAGE;
            response.json = { message: 'limit must be a number and less than 7' };
        } else {
            if (req.query.offset) offset = parseInt(req.query.offset);
            if (req.query.limit) {
                limit = parseInt(req.query.limit);
                if (limit > 7) {
                    response.status = process.env.CODE_400_MESSAGE;
                    response.json = { message: 'limit could not be more than 7' };
                    res.status(response.status).json(response.json);
                    return;
                }
            }
        }
    }
    
    if (pageNumber > 1) {
        offset = limit * (pageNumber - 1);
    }
    
    tripModelFindSkipLimitExecCallback(offset, limit, function (err, trips) {
        if (err) {
            response.status = process.env.SOMETHING_WRONG;
            response.json = { message: err.message };
        } else if (!trips.length) {
            response.status = process.env.NOT_FOUND_CODE;
            response.json = { message: process.env.CODE_404_MESSAGE };
        } else {
            response.status = process.env.GET_SUCCESS_CODE;
            response.json = trips;
        }
        res.status(response.status).json(response.json);
    });
};



const _createResponseObject=function(){
    const response={
        status:201,
        data:""
    };
    return response;
}

const _createNewTripObject=function(req,res){
    
    return new Promise((resolve)=>{
        let trip = {
            country: req.body.country,
            airport: req.body.airport,
            hotel: req.body.hotel,
            gallery: req.body.gallery
        };
        
        resolve(trip);
    });
}


const _sendResponse = function (res, response) {
    res.status(parseInt(response.status)).json(response.data);
}


const _setResponseDataRes = function(response, createdUser) {
    response.data = createdUser;
    response.status = 201;
};


const _setResponseToInternalError = function(response, error) {
    
    if(error){
        
        response.status = 500;
        response.data = error.message || 'Internal Server Error';
    }
};
const createTrip = function (req, res) {
    
    let trip = {
        country: req.body.country,
        airport: req.body.airport,
        hotel: req.body.hotel,
        gallery: req.body.gallery
    };
    
    const response=_createResponseObject();
    
    Trip.create(trip)
    .then(createdTrip=>_setResponseDataRes(response,createdTrip))
    .catch(error=>_setResponseToInternalError(response,error))
    .finally(()=>_sendResponse(res,response));
    
    
    // tripModelCreateCallback(trip, function (err, createdTrip) {
    //     let response = {
    //         status: process.env.GET_SUCCESS_CODE,
    //         json: []
    //     };
    //     if (err) {
    //         response.status = process.env.SOMETHING_WRONG;
    //         response.json = { message: err.message };
    //     } else {
    //         response.status = process.env.POST_SUCCESS_CODE;
    //         response.json = createdTrip;
    //     }
    //     res.status(response.status).json(response.json);
    // });
};

const findTripById = function (req, res) {
    let tripId = req.params.id;
    
    let response = {
        status: process.env.GET_SUCCESS_CODE,
        json: []
    };
    
    if (!mongoose.isValidObjectId(tripId)) {
        response.status = process.env.NOT_FOUND_CODE;
        response.json = { message: process.env.CODE_400_MESSAGE };
        res.status(response.status).json(response.json);
        return;
    }
    
    tripModelFindByIdExecCallback(tripId, function (err, trip) {
        if (err) {
            response.status = process.env.SOMETHING_WRONG;
            response.json = { message: err.message };
        } else if (!trip) {
            response.status = process.env.NOT_FOUND_CODE;
            response.json = { message: process.env.CODE_404_MESSAGE };
        } else {
            response.status = process.env.GET_SUCCESS_CODE;
            response.json = trip;
        }
        res.status(response.status).json(response.json);
    });
};

const deleteTripById = function (req, res) {
    let tripId = req.params.id;
    
    let response = {
        status: process.env.GET_SUCCESS_CODE,
        json: []
    };
    
    if (!mongoose.isValidObjectId(tripId)) {
        response.status = process.env.NOT_FOUND_CODE;
        response.json = { message: process.env.CODE_400_MESSAGE };
        res.status(response.status).json(response.json);
        return;
    }
    
    tripModelFindByIdExecCallback(tripId, function (err, trip) {
        if (err) {
            response.status = process.env.SOMETHING_WRONG;
            response.json = { message: err.message };
        } else if (!trip) {
            response.status = process.env.NOT_FOUND_CODE;
            response.json = { message: process.env.CODE_404_MESSAGE };
        } else {
            tripModelFindByIdAndDeleteExecCallback(tripId, function (err, deletedTrip) {
                if (err) {
                    response.status = process.env.SOMETHING_WRONG;
                    response.json = { message: err.message };
                } else {
                    response.status = process.env.DELETE_SUCCESS_CODE;
                    response.json = deletedTrip;
                }
                res.status(response.status).json(response.json);
            });
        }
    });
};

const fullUpdateTripById = function (req, res) {
    _updateTrip(req, res, _fullUpdate);
};

const partialUpdateTripById = function (req, res) {
    _updateTrip(req, res, _partialUpdate);
};

module.exports = {
    getAllTrips,
    createTrip,
    findTripById,
    deleteTripById,
    fullUpdateTripById,
    partialUpdateTripById
};
