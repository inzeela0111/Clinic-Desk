import Doctor from "../models/doctorModel.js";

//GET ALL DOCTORS

const getDoctors = async (req, res) => {
  //  res.send("GET ALL DOCTORS !.......")   
  try {
    const { speciality } = req.query;
    let query = {};
    if (speciality && speciality !== 'All') {
      query.speciality = speciality;
    }
    const doctors = await Doctor.find(query);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//GET SINGLE DOCTOR

const getDoctor = async (req, res) => {
  //  res.send("GET DOCTOR !.......")  
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

//CRETAE DOCTOR

const createDoctor = async (req, res) => {
  // res.send("DOCTOR CREATED !.......")
  try {
    const { name, speciality, image, bio, experience, fees, isAvailable, isActive } = req.body;
    const doctor = await Doctor.create({
      name,
      speciality,
      image,
      bio,
      experience,
      fees,
      isAvailable,
      isActive
    });
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//UPDATE DR.

const updateDoctor = async (req, res) => {
  // res.send("DOCTOR UPDATED !...")
  console.log("UPDATE DOCTOR REQUEST:", req.params.id, req.body);
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    console.log("UPDATE DOCTOR SUCCESS:", doctor.name, "Exp:", doctor.experience);
    res.json(doctor);
  } catch (error) {
    console.error("UPDATE DOCTOR ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
}

//DELETE DR.

const deleteDoctor = async (req, res) => {
  // res.send("DOCTOR DELETED !....")
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



const doctorController = { getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor }

export default doctorController