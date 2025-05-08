// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/login', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Login Control Service running on port ${PORT}`);
});
