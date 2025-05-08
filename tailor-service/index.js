// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const tailorRoutes = require('./routes/tailor.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tailors', tailorRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Tailor Service running on port ${PORT}`));
