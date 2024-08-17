const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;


require('dotenv').config();

const userModel = mongoose.model(process.env.USER_MODEL);


const _sendResponse = function (res, response) {
    res.status(Number(response.status)).json(response.data)
}
const _setErrorResponse = function (response, status, error) {
    response.status = status;
    response.data = { message: error };
}
const _isAUserExists = function (user) {
    const error = {
        status: process.env.NOT_FOUND_CODE,
        message: process.env.NOT_FOUND_MESSAGE
    }
    return new Promise((resolve, reject) => {
        if (user)
            resolve(user);
        else
            reject(error);
    })
}


const userModelFindByFieldWith = function (searchCriteriaObject) {
    return userModel.findOne(searchCriteriaObject).exec();
}


const _setDefaultResponse = function (statusCode, data) {
    return response = {
        status: statusCode,
        data: data
    }
}

const _isPasswordMatched = function (user, password) {
    const error = {
        status: process.env.INVALID_AUTHERIZED_CODE,
        data: process.env.INVALID_AUTHERIZED_MESSAGE
    }
    return new Promise((resovle, reject) => {
        if (bcrypt.compare(password, user.password))
            resovle(user)
        else
            reject(error)
    })
}

const _sendLoginUnsuccessfulResponse = function (response, status, error) {
    response.status = status;
    response.data = {message: error};
}

const _sendLoginSuccessResponseWithToken = function (user) {
    console.log(user);
    return new Promise((resovle, reject) => {
        try {
            const token = jwt.sign({ name: user.username}, process.env.JWT_SECRET, {expiresIn: '10h'});
            resovle(token)
        } catch (error) {
            reject(error)
        }
    })
}


const login = function (req, res) {
    // console.log('login called', req)
    let username = req.body.username;
    let password = req.body.password;
    let response = _setDefaultResponse(process.env.GET_SUCCESS_CODE, {});
    userModelFindByFieldWith({username: username})
        .then(user => _isAUserExists(user))
        .then(user => _isPasswordMatched(user, password))
        .then(user => _sendLoginSuccessResponseWithToken(user))
        .then(token => response.data = {token: token})
        .catch(error => _sendLoginUnsuccessfulResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, error.message))
        .finally(() => _sendResponse(res, response))
}

const isTokenProvided = function (token) {
    const error = {
        status: process.env.NOT_PROVIDE_TOKEN_CODE,
        message: process.env.NOT_PROVIDE_TOKEN_MESSAGE
    }

    return new Promise((resovle, reject) => {
        if (token) {
            resovle(token);
        } else {
            reject(error);
        }
    })
}

const _jwtVerifyWithPromisify = promisify(jwt.verify);

const isTokenAvailable = function (token) {
    const error = {
        status: process.env.NO_TOKEN_CODE,
        message: process.env.NO_TOKEN_MESSAGE
    }

    return new Promise((resovle, reject) => {
        if (token) {
            resovle(token);
        } else {
            reject(error);
        }
    })
}


const isValidToken = function (req, res, next) {

    if(req.headers[process.env.AUTHORIZATION]==undefined){
        _sendResponse(res, {status: 401, data: process.env.UNAUTHORIZED})

    }
    const authorizationToken = req.headers[process.env.AUTHORIZATION];
    const token = authorizationToken.split(" ")[1];
    try {
        let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (anyerror) {
        _sendResponse(res, {status: 401, data: process.env.UNAUTHORIZED})

    }
    return;


}


module.exports = {
    login,
    isValidToken
}