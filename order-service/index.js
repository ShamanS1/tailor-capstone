// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const orderRoutes = require('./routes/order.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
