import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID is required"],
    },
    date: {
      type: String, // "2026-04-15" format (YYYY-MM-DD)
      required: [true, "Date is required"],
    },
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    startTime: {
      type: String, // "09:00 AM"
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String, // "09:30 AM"
      required: [true, "End time is required"],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ek doctor ke ek din mein same time pe 2 slots na ban jayein
slotSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });
const Slot = mongoose.model("Slot", slotSchema);

export default Slot;