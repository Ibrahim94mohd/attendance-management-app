import express from 'express';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Mark attendance for current day
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const userId = req.user._id;

    if (!status || !['Present', 'Absent'].includes(status)) {
      return res.status(400).json({ message: 'Valid status (Present/Absent) is required' });
    }

    // Get current date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance already marked for today
    const existingAttendance = await Attendance.findOne({
      userId,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({ 
        message: 'Attendance already marked for today',
        attendance: existingAttendance
      });
    }

    // Create new attendance record
    const attendance = new Attendance({
      userId,
      date: today,
      status,
      notes: notes || ''
    });

    await attendance.save();
    await attendance.populate('userId', 'username firstName lastName');

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Server error while marking attendance' });
  }
});

// Get attendance records for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 30 } = req.query;

    const attendanceRecords = await Attendance.find({ userId })
      .populate('userId', 'username firstName lastName')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalRecords = await Attendance.countDocuments({ userId });
    const presentCount = await Attendance.countDocuments({ userId, status: 'Present' });
    const attendancePercentage = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

    res.json({
      attendanceRecords,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords
      },
      statistics: {
        totalDays: totalRecords,
        presentDays: presentCount,
        absentDays: totalRecords - presentCount,
        attendancePercentage: parseFloat(attendancePercentage)
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error while fetching attendance' });
  }
});

// Get attendance for specific user (admin only)
router.get('/user/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 30 } = req.query;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const attendanceRecords = await Attendance.find({ userId })
      .populate('userId', 'username firstName lastName')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalRecords = await Attendance.countDocuments({ userId });
    const presentCount = await Attendance.countDocuments({ userId, status: 'Present' });
    const attendancePercentage = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

    res.json({
      user,
      attendanceRecords,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords
      },
      statistics: {
        totalDays: totalRecords,
        presentDays: presentCount,
        absentDays: totalRecords - presentCount,
        attendancePercentage: parseFloat(attendancePercentage)
      }
    });
  } catch (error) {
    console.error('Get user attendance error:', error);
    res.status(500).json({ message: 'Server error while fetching user attendance' });
  }
});

// Get today's attendance status
router.get('/today', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await Attendance.findOne({
      userId,
      date: today
    }).populate('userId', 'username firstName lastName');

    res.json({
      hasMarkedToday: !!todayAttendance,
      attendance: todayAttendance
    });
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ message: 'Server error while checking today attendance' });
  }
});

export default router;