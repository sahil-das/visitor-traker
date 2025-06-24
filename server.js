// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const fetch = require('node-fetch'); // Add this line

const activityRoutes = require('./routes/activityRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/activity', activityRoutes);
app.use('/api/admin', adminRoutes);

// Optional root endpoint
app.get('/', (req, res) => {
  res.send('🟢 API is running and awake!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));

console.log('Node version:', process.version);

// 🔄 Self-ping script (to prevent Render sleep)
const SELF_URL = process.env.SELF_URL || `http://localhost:${PORT}`;

setInterval(() => {
  fetch(SELF_URL)
    .then(res => console.log(`🔁 Self-ping status: ${res.status}`))
    .catch(err => console.error('❌ Self-ping failed:', err.message));
}, 5 * 60 * 1000); // every 5 minutes