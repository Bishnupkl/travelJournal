const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const userModel = mongoose.model(process.env.USER_MODEL);



const _sendResponse = function (res, response) {
    res.status(Number(response.status)).json(response.data)
}

const _ifFoundAUser = function (user) {
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

const _ifPasswordMatch = function (user, password) {
    const error = {
        status: process.env.INVALID_AUTHERIZED_CODE,
        message: process.env.INVALID_AUTHERIZED_MESSAGE
    }
    return new Promise((resovle, reject) => {
        if (bcrypt.compare(password, user.password))
            resovle(user)
        else
        reject(error)
    })
}

const _setErrorResponse = function (response, status, error) {
    console.log('set error response');
    response.status = status;
    response.data = { message: error };
}

const _createToken = function (user) {
    return new Promise((resovle, reject) => {
        try {
            const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            resovle(token)
        }
        catch (error) {
            reject(error)
        }
    })
}


const login = function (req, res) {
    console.log('login called', req)
    let username = req.body.username;
    let password = req.body.password;
    let response = _setDefaultResponse(process.env.GET_SUCCESS_CODE, {});
    userModelFindByFieldWith({ username: username })
    .then(user => _ifFoundAUser(user))
    .then(user => _ifPasswordMatch(user, password))
    .then(user => _createToken(user))
    .then(token => response.data = { token: token })
    .catch(error => _setErrorResponse(response, error.status || process.env.SOMETHING_WRONG_CODE, error.message))
    .finally(() => _sendResponse(res, response))
}

module.exports = {
    login
}