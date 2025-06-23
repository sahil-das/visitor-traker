// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const activityRoutes = require('./routes/activityRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/activity', activityRoutes);
app.use('/api/admin', adminRoutes);

// Only use bodyParser.json() for other routes, not for /api/activity/log
app.use(bodyParser.json()); // <-- This should come AFTER activityRoutes, or use express.json() only for admin routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
