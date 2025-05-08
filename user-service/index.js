const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Change route prefix from /api/users to /users
app.use('/users', userRoutes);

app.use(errorHandler);

// Change port from 5002 to 3006
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
