const express = require('express');
const app = express();
const db = require('./api/data/db');
const router = require('./api/routes');
require('dotenv').config();




app.use(process.env.SUB_SET_ROUTE, function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
  res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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


