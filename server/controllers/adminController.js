import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";

// @desc    Dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalDoctors, totalUsers, totalAppointments, totalSlots] = await Promise.all([
      Doctor.countDocuments({ isActive: true }),
      User.countDocuments({ isAdmin: false, isActive: true }),
      Appointment.countDocuments(),
      Slot.countDocuments(),
    ]);

    const statusBreakdown = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const dailyStats = await Appointment.aggregate([
      { $match: { appointmentDate: { $gte: sevenDaysAgoStr } } },
      {
        $group: {
          _id:       "$appointmentDate",
          total:     { $sum: 1 },
          confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
          pending:   { $sum: { $cond: [{ $eq: ["$status", "pending"]   }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", total: 1, confirmed: 1, pending: 1, cancelled: 1 } },
    ]);

    const doctorStats = await Appointment.aggregate([
      {
        $group: {
          _id:           "$doctorId",
          totalBookings: { $sum: 1 },
          confirmed:     { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
          pending:       { $sum: { $cond: [{ $eq: ["$status", "pending"]   }, 1, 0] } },
          cancelled:     { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from:         "doctors",
          localField:   "_id",
          foreignField: "_id",
          as:           "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $project: {
          _id:           0,
          doctorId:      "$_id",
          name:          "$doctor.name",
          speciality:    "$doctor.speciality",
          image:         "$doctor.image",
          totalBookings: 1,
          confirmed:     1,
          pending:       1,
          cancelled:     1,
        },
      },
      { $sort: { totalBookings: -1 } },
    ]);

    const today = new Date().toISOString().split("T")[0];

    const todayAppointments = await Appointment.find({
      appointmentDate: today,
      status: { $ne: "cancelled" },
    })
      .populate("userId",   "name phone")
      .populate("doctorId", "name speciality")
      .sort({ time: 1 });

    res.status(200).json({
      success: true,
      data: {
        overview: { totalDoctors, totalUsers, totalAppointments, totalSlots },
        statusBreakdown,
        dailyStats,
        doctorStats,
        todayAppointments,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Aaj ka schedule
// @route   GET /api/admin/today
// @access  Admin
const getTodaySchedule = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const appointments = await Appointment.find({
      appointmentDate: today,
      status: { $ne: "cancelled" },
    })
      .populate("userId",   "name phone email")
      .populate("doctorId", "name speciality image")
      .populate("slotId",   "startTime endTime")
      .sort({ time: 1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Monthly revenue
// @route   GET /api/admin/revenue
// @access  Admin
const getRevenueStats = async (req, res) => {
  try {
    const revenueByMonth = await Appointment.aggregate([
      { $match: { status: "confirmed" } },
      {
        $lookup: {
          from:         "doctors",
          localField:   "doctorId",
          foreignField: "_id",
          as:           "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $group: {
          _id:     { $substr: ["$appointmentDate", 0, 7] },
          revenue: { $sum: "$doctor.fees" },
          count:   { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: "$_id", revenue: 1, count: 1 } },
    ]);

    res.status(200).json({ success: true, data: revenueByMonth });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminController = { getDashboardStats, getTodaySchedule, getRevenueStats };
export default adminController;