const express = require('express');
const app = express();
const db = require('./data/db');
const tripRoutes = require('./routes/tripRoutes');
require('dotenv').config();

app.use(express.json());

app.use('/trips', tripRoutes);
const PORT = process.env.PORT || 3000;
const SERVER_MSG = process.env.SERVER_MSG || "Server is running on port";
app.listen(PORT, () => {
  console.log(`${SERVER_MSG} ${PORT}`);
});
