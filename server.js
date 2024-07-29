const express = require('express');
const app = express();
const db = require('./data/db');
const tripRoutes = require('./routes/tripRoutes');
require('dotenv').config();

app.use(express.json());

app.use('/trips', tripRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
