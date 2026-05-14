import Appointment from "../models/appointmentModel.js";
import Slot from "../models/slotModel.js";
import Doctor from "../models/doctorModel.js";

// @desc    Appointment book karo
// @route   POST /api/appointments
// @access  User
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, symptoms } = req.body;

    if (!doctorId || !slotId) {
      return res.status(400).json({ success: false, message: "doctorId aur slotId required hai" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ success: false, message: "Doctor nahi mila" });
    }

    if (!doctor.isAvailable) {
      return res.status(400).json({ success: false, message: "Doctor abhi bookings ke liye available nahi hai" });
    }

    const slot = await Slot.findOne({ _id: slotId, doctorId, isBooked: false });
    if (!slot) {
      return res.status(400).json({ success: false, message: "Slot available nahi hai ya already booked hai" });
    }

    const alreadyBooked = await Appointment.findOne({ userId: req.user._id, slotId });
    if (alreadyBooked) {
      return res.status(400).json({ success: false, message: "Aapne ye slot pehle se book kar rakha hai" });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorId,
      slotId,
      appointmentDate: slot.date,
      time: `${slot.startTime} - ${slot.endTime}`,
      symptoms: symptoms || "",
    });

    // Slot lock karo
    await Slot.findByIdAndUpdate(slotId, { isBooked: true });

    const populated = await Appointment.findById(appointment._id)
      .populate("doctorId", "name speciality fees image")
      .populate("slotId", "date day startTime endTime");

    res.status(201).json({ success: true, data: populated });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apni appointments dekho
// @route   GET /api/appointments/mine
// @access  User
const getMyAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "name speciality fees image")
      .populate("slotId", "date day startTime endTime")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Single appointment detail
// @route   GET /api/appointments/:id
// @access  User
const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate("doctorId", "name speciality fees image bio")
      .populate("slotId", "date day startTime endTime")
      .populate("userId", "name email phone");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment nahi mili" });
    }

    res.status(200).json({ success: true, data: appointment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    User apni appointment cancel kare
// @route   PATCH /api/appointments/:id/cancel
// @access  User
const cancelMyAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment nahi mili" });
    }
    if (appointment.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Ye appointment pehle se cancel ho chuki hai" });
    }
    if (appointment.status === "confirmed") {
      return res.status(400).json({ success: false, message: "Confirmed appointment cancel nahi ho sakti. Clinic se contact karo." });
    }

    appointment.status = "cancelled";
    await appointment.save();

    // Slot wapas free karo
    await Slot.findByIdAndUpdate(appointment.slotId, { isBooked: false });

    res.status(200).json({ success: true, message: "Appointment cancel ho gayi", data: appointment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Saari appointments — Admin
// @route   GET /api/appointments
// @access  Admin
const getAllAppointments = async (req, res) => {
  try {
    const { status, date, doctorId } = req.query;

    const filter = {};
    if (status)   filter.status          = status;
    if (date)     filter.appointmentDate = date;
    if (doctorId) filter.doctorId        = doctorId;

    const appointments = await Appointment.find(filter)
      .populate("userId",   "name email phone")
      .populate("doctorId", "name speciality")
      .populate("slotId",   "date day startTime endTime")
      .sort({ appointmentDate: 1, time: 1 });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin status update kare
// @route   PATCH /api/appointments/:id/status
// @access  Admin
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log("Status update request received:", status);

    const allowedStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Sirf ye allowed: ${allowedStatuses.join(' | ')}` });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment nahi mili" });
    }

    const wasCancel = appointment.status === "cancelled";
    const isCancel  = status === "cancelled";

    // Cancelled ki taraf → slot free karo
    if (isCancel && !wasCancel) {
      await Slot.findByIdAndUpdate(appointment.slotId, { isBooked: false });
    }

    // Cancelled se wapas active → slot check karo
    if (!isCancel && wasCancel) {
      const slotFree = await Slot.findOne({ _id: appointment.slotId, isBooked: false });
      if (!slotFree) {
        return res.status(400).json({ success: false, message: "Slot kisi aur ne book kar liya, re-activate nahi ho sakta" });
      }
      await Slot.findByIdAndUpdate(appointment.slotId, { isBooked: true });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ success: true, message: `Status '${status}' ho gaya`, data: appointment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Appointment feedback submit karo
// @route   PATCH /api/appointments/:id/feedback
// @access  User
const submitFeedback = async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating 1 to 5 ke beech honi chahiye" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment nahi mili" });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({ success: false, message: "Sirf completed appointments par hi feedback diya ja sakta hai" });
    }

    if (appointment.rating) {
      return res.status(400).json({ success: false, message: "Aap pehle hi feedback de chuke hain" });
    }

    appointment.rating = rating;
    appointment.feedback = feedback || "";
    await appointment.save();

    res.status(200).json({ success: true, message: "Feedback submit ho gaya. Shukriya!", data: appointment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const appointmentController = {
  bookAppointment,
  getMyAppointments,
  getAppointment,
  cancelMyAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  submitFeedback,
};
export default appointmentController;