import express from 'express';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

    // Get attendance statistics for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const totalRecords = await Attendance.countDocuments({ userId: user._id });
      const presentCount = await Attendance.countDocuments({ userId: user._id, status: 'Present' });
      const attendancePercentage = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

      return {
        ...user.toObject(),
        statistics: {
          totalDays: totalRecords,
          presentDays: presentCount,
          absentDays: totalRecords - presentCount,
          attendancePercentage: parseFloat(attendancePercentage)
        }
      };
    }));

    res.json({
      users: usersWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

export default router;