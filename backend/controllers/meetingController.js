const Meeting = require('../models/Meeting');

// Local dev memory pool to simulate database storage in bypass sandbox mode
const localMeetingsMockDB = [];

// 1. SCHEDULE A MEETING (With Sandbox Conflict Detection Fixed)
exports.scheduleMeeting = async (req, res) => {
  try {
    const { investorId, entrepreneurId, title, description, date, time } = req.body;

    console.log("--> Checking meeting conflict for date/time:", date, time);

    // FIXED CHECK: Ab status accepted ho ya pending, agar same date aur time par meeting mojud hai toh conflict trigger hoga
    const hasConflict = localMeetingsMockDB.some(m => m.date === date && m.time === time);
    
    if (hasConflict) {
      return res.status(400).json({ 
        message: 'Conflict Detected! This time slot is already booked on Nexus Server. Please choose another time.' 
      });
    }

    // React architecture mapped meeting object structure
    const newMeeting = {
      id: `M_${Math.random().toString(36).substring(2, 9)}`,
      entrepreneur: entrepreneurId || "U_mock_entrepreneur_849",
      investor: investorId || "U_mock_investor_102",
      title,
      description: description || "",
      date,
      time,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Push into our local mock database array
    localMeetingsMockDB.push(newMeeting);
    console.log("Current Live Mock Database Entries:", localMeetingsMockDB.length);

    return res.status(201).json({
      success: true,
      message: 'Meeting scheduled successfully (Pending Confirmation)!',
      meeting: newMeeting
    });

  } catch (err) {
    console.error("Meeting scheduling sandbox error:", err.message);
    return res.status(500).json({ message: 'Server error during meeting schedule simulation' });
  }
};

// 2. GET USER MEETINGS
exports.getMeetings = async (req, res) => {
  try {
    // If local storage is empty, return default framework layout arrays
    if (localMeetingsMockDB.length === 0) {
      return res.json([
        {
          id: "m1",
          title: "Nexus Initial Pitch Review",
          description: "Discussing Week 1 and Week 2 milestones.",
          date: "2026-05-28",
          time: "14:00",
          status: "accepted"
        },
        {
          id: "m2",
          title: "Seed Funding Round Discussion",
          description: "Financial layout projections discussion.",
          date: "2026-06-02",
          time: "11:30",
          status: "pending"
        }
      ]);
    }
    return res.json(localMeetingsMockDB);
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching meetings' });
  }
};

// 3. UPDATE MEETING STATUS (Accept/Reject)
exports.updateMeetingStatus = async (req, res) => {
  try {
    const { meetingId, status } = req.body;

    // Find and update status in local mockup reference
    const meetingIndex = localMeetingsMockDB.findIndex(m => m.id === meetingId);
    if (meetingIndex !== -1) {
      localMeetingsMockDB[meetingIndex].status = status;
    }

    return res.json({
      success: true,
      message: `Meeting status updated to ${status} successfully!`,
      meetingId,
      status
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error updating meeting status' });
  }
};