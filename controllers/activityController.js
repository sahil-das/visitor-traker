// controllers/activityController.js
const Activity = require('../models/Activity');
const UAParser = require('ua-parser-js');
const axios = require('axios');

exports.logActivity = async (req, res) => {
  console.log('--- logActivity route HIT ---');
  let data = req.body;
  if (Buffer.isBuffer(data)) {
    try {
      data = JSON.parse(data.toString());
    } catch (e) {
      return res.status(400).json({ message: 'Invalid JSON' });
    }
  }
  console.log('Received activity:', data);
  console.log('Raw req.body:', req.body, 'Type:', typeof req.body, 'IsBuffer:', Buffer.isBuffer(req.body));
  try {
    const parser = new UAParser(req.headers['user-agent']);
    const uaResult = parser.getResult();
    const deviceModel = uaResult.device.model || 'Unknown';
    const deviceType = uaResult.device.type || 'desktop';
    const deviceVendor = uaResult.device.vendor || 'Unknown';
    const browser = uaResult.browser.name || 'Unknown';
    const os = uaResult.os.name || 'Unknown';

    // Get client IP (first in x-forwarded-for if present)
    const ipRaw = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ip = Array.isArray(ipRaw) ? ipRaw[0] : (ipRaw ? ipRaw.split(',')[0].trim() : '');
    console.log('IP for geolocation:', ip);
    const { page, timeSpent } = data;

    // Get location info from IP
    let city = 'Unknown', country = 'Unknown';
    console.log('Fetching geolocation for IP:', ip);
    try {
      const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
      console.log('Geo API response:', geoRes.data);
      if (geoRes.data && geoRes.data.status === 'success') {
        city = geoRes.data.city;
        country = geoRes.data.country;
      } else {
        console.log('Geo API failed or returned non-success status:', geoRes.data);
      }
    } catch (geoErr) {
      console.error('Geo API error:', geoErr);
    }

    const newActivity = new Activity({
      ip,
      browser,
      os,
      deviceType,
      deviceModel,
      deviceVendor,
      page,
      timeSpent,
      city,
      country
    });

    await newActivity.save();
    res.status(201).json({ message: 'Activity logged' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
