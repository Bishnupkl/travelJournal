const express = require('express');
const app = express();
const db = require('./api/data/db');
const router = require('./api/routes');
require('dotenv').config();

app.use(process.env.SUB_SET_ROUTE, function (req, res, next) {
  res.header(process.env.ACCESS_CONTROL_ALLOW_ORIGIN, process.env.APPLICATION);
  res.header(process.env.ACCESS_CONTROL_ALLOW_METHODS, process.env.METHODS);
  res.header(process.env.ACCESS_CONTROL_ALLOW_HEADERS, process.env.HEADERS);
  next();
});
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use(process.env.SUB_SET_ROUTE, router);



const PORT = process.env.PORT || 3000;
const SERVER_MSG = process.env.SERVER_MSG || "Server is running on port";
app.listen(PORT, () => {
  console.log(`${SERVER_MSG} ${PORT}`);
});


