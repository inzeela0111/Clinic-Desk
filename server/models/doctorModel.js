import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Doctor Name"],
    },


    speciality: {
      type: String,
      required: [true, "Please Enter Speciality"],
      enum: [
        "General Physician",
        "Cardiologist",
        "Dermatologist",
        "Orthopedic",
        "Neurologist",
        "ENT",
      ],
    },

    experience: {
      type: Number,
      required: [true, "Please Enter Experience in years"],
    },

    fees: {
      type: Number,
      required: [true, "Please Enter Consultation Fees"],
    },

    bio: {
      type: String,
      required: [true, "Please Enter Doctor Bio"],
    },

    image: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
