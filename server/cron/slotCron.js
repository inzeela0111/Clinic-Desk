import cron from 'node-cron';
import Doctor from '../models/doctorModel.js';
import Slot from '../models/slotModel.js';

const generateTimeSlots = (startTime = '09:00', endTime = '17:00', interval = 30) => {
  const slots = [];
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let cur = sh * 60 + sm;
  const end = eh * 60 + em;
  while (cur + interval <= end) {
    const fmt = (m) => {
      const h = Math.floor(m / 60), min = m % 60, ampm = h < 12 ? 'AM' : 'PM';
      const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return `${hh}:${min.toString().padStart(2, '0')} ${ampm}`;
    };
    slots.push({ startTime: fmt(cur), endTime: fmt(cur + interval) });
    cur += interval;
  }
  return slots;
};

const getLocalDateStr = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const runSlotAutomation = async () => {
  console.log('⏳ Running Slot Automation: Generating daily slots and cleaning old slots...');
  try {
    const today = new Date();
    const todayStr = getLocalDateStr(today);

    // 1. Delete old slots (older than today)
    const deleted = await Slot.deleteMany({ date: { $lt: todayStr } });
    console.log(`✅ Deleted ${deleted.deletedCount} past slots.`);

    // 2. Find all active doctors
    const doctors = await Doctor.find({ isActive: true });
    
    if (doctors.length === 0) {
      console.log('ℹ️ No active doctors found to generate slots.');
      return;
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const generatedSlots = generateTimeSlots(); // 09:00 AM to 05:00 PM, 30 min intervals
    let newSlotsInserted = 0;

    // 3. Generate slots for next 3 days (Today, Tomorrow, Day After)
    for (let i = 0; i < 3; i++) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + i);
      const dateStr = getLocalDateStr(targetDate);
      const dayName = dayNames[targetDate.getDay()];

      console.log(`ℹ️ Processing slots for date: ${dateStr} (${dayName})`);

      for (const doctor of doctors) {
        const slotsToInsert = generatedSlots.map((s) => ({
          doctorId: doctor._id,
          date: dateStr,
          day: dayName,
          startTime: s.startTime,
          endTime: s.endTime,
        }));

        try {
          // ordered: false allows continuing even if some slots already exist (unique index violation)
          await Slot.insertMany(slotsToInsert, { ordered: false });
          newSlotsInserted += slotsToInsert.length; 
        } catch (err) {
          if (err.code === 11000) {
             // Some were inserted, some skipped. Count only non-duplicates if possible, 
             // but easier to just log completion.
             newSlotsInserted += (err.result?.nInserted || 0);
          } else {
             console.error(`❌ Error inserting slots for doctor ${doctor.name} (${doctor._id}) on ${dateStr}:`, err.message);
          }
        }
      }
    }

    console.log(`✅ Slot Automation Finished. Added/Verified slots for the next 3 days.`);

  } catch (error) {
    console.error('❌ Error in runSlotAutomation:', error.message);
  }
};

// Har raat 12 baje chalega
cron.schedule('0 0 * * *', runSlotAutomation);

export default runSlotAutomation;
