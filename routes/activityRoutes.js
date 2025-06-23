// routes/activityRoutes.js
const express = require('express');
const { logActivity } = require('../controllers/activityController');
const router = express.Router();

router.post('/log', express.raw({ type: '*/*' }), logActivity);

module.exports = router;
