const mongoose= require("mongoose");
require('dotenv').config();

require("./../components/trips/tripmodel");
require("./../components/users/usermodel");

const callBackify=require("util").callbackify;
const mongooseDisConnectWithCallback = callBackify(mongoose.disconnect);

mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
mongoose.connection.on("connected", function () {
    console.log(`${process.env.DB_CONNECT} ${process.env.DB_NAME}`);
})

mongoose.connection.on("disconnected", function () {
    console.log(`${process.env.DB_DISCONNECT} ${process.env.DB_NAME}`);
})
mongoose.connection.on("error", function () {
    console.log(`${process.env.DB_CONNECT_ERROR}`);
})

process.on("SIGINT", function () {
    mongooseDisConnectWithCallback(function () {
        process.exit(0);
    });
})
process.on("SIGTERM", function () {
    mongooseClientConnect(function () {
        process.exit(0);
    });
})
