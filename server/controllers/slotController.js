import Slot from "../models/slotModel.js";
import Doctor from "../models/doctorModel.js";

// @desc    Create one slot
// @route   POST /api/slots
// @access  Admin
const createSlot = async (req, res) => {
  try {
    const { doctorId, date, day, startTime, endTime } = req.body;

    if (!doctorId || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: "doctorId, date, startTime, endTime required hai" });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ success: false, message: "Date format YYYY-MM-DD hona chahiye" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ success: false, message: "Doctor nahi mila" });
    }

    const slot = await Slot.create({ doctorId, date, day, startTime, endTime });
    res.status(201).json({ success: true, data: slot });

  } catch (error) {
    // Duplicate slot error
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Ye slot already exist karta hai" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk create slots
// @route   POST /api/slots/bulk
// @access  Admin
const createBulkSlots = async (req, res) => {
  try {
    const { doctorId, date, day, slots } = req.body;

    if (!doctorId || !date || !Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ success: false, message: "doctorId, date aur slots array required hai" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ success: false, message: "Doctor nahi mila" });
    }

    const slotsToInsert = slots.map((s) => ({
      doctorId, date, day,
      startTime: s.startTime,
      endTime: s.endTime,
    }));

    // ordered: false → duplicates skip karo, baaki insert karo
    const inserted = await Slot.insertMany(slotsToInsert, { ordered: false }).catch((err) => {
      if (err.code === 11000) return err.insertedDocs || [];
      throw err;
    });

    res.status(201).json({
      success: true,
      message: `${inserted.length} slot(s) create ho gaye`,
      data: inserted,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get available slots for a doctor
// @route   GET /api/slots/:doctorId
// @access  Public
const getDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const filter = { doctorId, isBooked: false };
    if (date) filter.date = date;

    const slots = await Slot.find(filter).sort({ startTime: 1 });
    
    console.log("doctorId:", req.params.doctorId);
    console.log("date:", req.query.date);
    console.log("found:", slots.length);

    res.status(200).json({ success: true, count: slots.length, data: slots });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get ALL slots — admin view
// @route   GET /api/slots/admin/:doctorId
// @access  Admin
const getAllDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const filter = { doctorId };
    if (date) filter.date = date;

    const slots = await Slot.find(filter).sort({ date: 1, startTime: 1 });
    res.status(200).json({ success: true, count: slots.length, data: slots });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a slot (only if not booked)
// @route   DELETE /api/slots/:id
// @access  Admin
const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot nahi mila" });
    }
    if (slot.isBooked) {
      return res.status(400).json({ success: false, message: "Booked slot delete nahi ho sakta. Pehle appointment cancel karo." });
    }

    await slot.deleteOne();
    res.status(200).json({ success: true, message: "Slot delete ho gaya" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const slotController = { createSlot, createBulkSlots, getDoctorSlots, getAllDoctorSlots, deleteSlot };
export default slotController;