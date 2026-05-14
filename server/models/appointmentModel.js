import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    appointmentDate: {
      type: String, // "2026-04-15"
      required: true,
    },
    time  : {
      type : String,
      required : true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    symptoms: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      default: "",
    },
   
  },
  {
    timestamps: true,
  }
);

// Ek user same slot dobara book na kar sake
appointmentSchema.index({ userId: 1, slotId: 1 }, { unique: true });

// Admin filtering ke liye fast queries
appointmentSchema.index({ status: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;