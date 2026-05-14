


import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, gender } = req.body;

    // Check all fields
    if (!name || !email || !phone || !password || !gender) {
      return res.status(400).json({ success: false, message: "Please fill all details including gender" });
    }

    // Check if user already exists
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const phoneExist = await User.findOne({ phone });
    if (phoneExist) {
      return res.status(409).json({ success: false, message: "Phone already registered" });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      gender,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        image: user.image,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        createdAt: user.createdAt,
        token: generateToken(user._id),
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all details" });
    }

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Check account active hai
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account deactivated. Contact support." });
    }

    // Password match karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        image: user.image,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        createdAt: user.createdAt,
        token: generateToken(user._id),
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get own profile
// @route   GET /api/auth/profile
// @access  Protected
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update own profile
// @route   PUT /api/auth/profile
// @access  Protected
const updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, image } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (image) user.image = image;

    const updated = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        gender: updated.gender,
        image: updated.image,
        isAdmin: updated.isAdmin,
        isActive: updated.isActive,
        token: generateToken(updated._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change User Password
// @route   PUT /api/auth/change-password
// @access  Protected
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Please provide both old and new passwords" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect old password" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);

    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users — Admin
// @route   GET /api/auth/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    User block/unblock — Admin
// @route   PATCH /api/auth/users/:id/toggle
// @access  Admin
// const toggleUserStatus = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     user.isActive = !user.isActive;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
//       data: { _id: user._id, name: user.name, isActive: user.isActive },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const authController = { registerUser, loginUser, getProfile, updateProfile, changePassword, getAllUsers };
export default authController;