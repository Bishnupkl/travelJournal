const express = require("express");
const tripsRouter = require("../components/trips/trips-routes");
const router = express.Router();


router.use("/trips", tripsRouter);

module.exports= router;