const mongoose= require("mongoose");
require('dotenv').config();

require("./tripmodel");

const callBackify=require("util").callbackify;
const mongooseDisConnectWithCallback = callBackify(mongoose.disconnect);

mongoose.connect(process.env.MONGO_URI+process.env.DB_NAME);
mongoose.connection.on("connected", function () {
    console.log("Mongoose connected to travelJournal");
})

mongoose.connection.on("disconnected", function () {
    console.log("Mongoose disconnected to travelJournal");
})
mongoose.connection.on("error", function () {
    console.log("Mongoose error");
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
