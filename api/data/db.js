const mongoose= require("mongoose");
require('dotenv').config();

require("./../components/trips/tripmodel");
require("./../components/users/usermodel");

const callBackify=require("util").callbackify;
const mongooseDisConnectWithCallback = callBackify(mongoose.disconnect);

mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
mongoose.connection.on(process.env.DB_CONNECTED_METHOD, function () {
    console.log(`${process.env.DB_CONNECT} ${process.env.DB_NAME}`);
})

mongoose.connection.on(process.env.DB_DICONNECTED_METHOD, function () {
    console.log(`${process.env.DB_DISCONNECT} ${process.env.DB_NAME}`);
})
mongoose.connection.on(process.env.DB_CONNECT_ERROR, function () {
    console.log(`${process.env.DB_CONNECT_ERROR}`);
})

process.on(process.env.DB_ON_SIGINT_METHOD, function () {
    mongooseDisConnectWithCallback(function () {
        process.exit(0);
    });
})
process.on(process.env.DB_ON_SIGTERM_METHOD, function () {
    mongooseDisConnectWithCallback(function () {
        process.exit(0);
    });
})

mongoose.connection.on(process.env.DB_ON_SIGURS2_METHOD, function () {
    console.log(process.env.DB_CONNECTION_PROBLEM);
    mongooseDisConnectWithCallback(function () {
        process.exit(0);
    });
})
