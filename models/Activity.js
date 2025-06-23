// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  ip: String,
  browser: String,
  os: String,
  deviceType: String,
  deviceModel: String, // Added
  deviceVendor: String, // Added
  page: String,
  timeSpent: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);
