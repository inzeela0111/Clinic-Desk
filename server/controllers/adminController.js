import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Slot from "../models/slotModel.js";

// @desc    Dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const isPatient = !req.user.isAdmin;
    const patientFilter = isPatient ? { userId: req.user._id } : {};
    
    console.log("DEBUG: Dashboard stats request", { 
      userName: req.user.name, 
      isAdmin: req.user.isAdmin, 
      isPatient, 
      patientFilter 
    });

    const [totalDoctors, totalUsers, totalAppointments, totalSlots] = await Promise.all([
      Doctor.countDocuments({ isActive: true }),
      isPatient ? 0 : User.countDocuments({ isAdmin: false, isActive: true }),
      Appointment.countDocuments(patientFilter),
      isPatient ? 0 : Slot.countDocuments(),
    ]);

    const statusBreakdown = await Appointment.aggregate([
      { $match: patientFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]);

    const range = req.query.range || "week";
    const startDate = new Date();
    if (range === "month") {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate.setDate(startDate.getDate() - 7);
    }
    const startDateStr = startDate.toISOString().split("T")[0];

    const dailyStats = await Appointment.aggregate([
      { $match: { ...patientFilter, appointmentDate: { $gte: startDateStr } } },
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
      ...patientFilter,
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
    const patientFilter = !req.user.isAdmin ? { userId: req.user._id } : {};

    const appointments = await Appointment.find({
      ...patientFilter,
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

// @desc    Sabh patients ki list
// @route   GET /api/admin/patients
// @access  Admin
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ isAdmin: false })
      .select("-password")
      .sort({ createdAt: -1 });

    // Har patient ke liye appointment count aur last appointment calculate karein
    const patientsWithStats = await Promise.all(
      patients.map(async (patient) => {
        const appointmentCount = await Appointment.countDocuments({ userId: patient._id });
        const lastAppointment = await Appointment.findOne({ userId: patient._id })
          .sort({ appointmentDate: -1, time: -1 })
          .populate("doctorId", "name");

        return {
          ...patient._doc,
          appointmentCount,
          lastAppointment: lastAppointment ? {
            date: lastAppointment.appointmentDate,
            doctor: lastAppointment.doctorId?.name
          } : null
        };
      })
    );

    res.status(200).json({ success: true, count: patients.length, data: patientsWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Patient ki details aur history
// @route   GET /api/admin/patients/:id
// @access  Admin
const getPatientDetails = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select("-password");
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient nahi mila" });
    }

    const appointments = await Appointment.find({ userId: req.params.id })
      .populate("doctorId", "name speciality image")
      .populate("slotId", "startTime endTime")
      .sort({ appointmentDate: -1, time: -1 });

    res.status(200).json({
      success: true,
      data: {
        profile: patient,
        appointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminController = { getDashboardStats, getTodaySchedule, getRevenueStats, getAllPatients, getPatientDetails };
export default adminController;