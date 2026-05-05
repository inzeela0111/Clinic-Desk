import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Slot from './server/models/slotModel.js';
import Doctor from './server/models/doctorModel.js';

dotenv.config();

const checkSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clinic-desk');
    console.log('Connected to DB');

    const slots = await Slot.find({});
    console.log('Total slots:', slots.length);
    if (slots.length > 0) {
      console.log('Sample slot dates:', [...new Set(slots.map(s => s.date))]);
    }

    const doctors = await Doctor.find({ isActive: true });
    console.log('Active doctors count:', doctors.length);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkSlots();
