// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const measurementRoutes = require('./routes/measurement.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/measurements', measurementRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Measurement Service running on port ${PORT}`));
