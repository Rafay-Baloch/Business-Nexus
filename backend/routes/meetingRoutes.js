const express = require('express');
const router = express.Router();
const { scheduleMeeting, getMeetings, updateMeetingStatus } = require('../controllers/meetingController');

// Routes mapping
router.post('/schedule', scheduleMeeting);
router.get('/list', getMeetings);
router.put('/status', updateMeetingStatus);

module.exports = router;