
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const forUser = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      req.user = user;
      next();
    } else {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};

const forAdmin = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      req.user = user;
      if (user.isAdmin) {
        next();
      } else {
        return res.status(403).json({ success: false, message: "Access denied: Admins only" });
      }
    } else {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};


const protect = {forUser , forAdmin }

export default protect;


// ..........................................................................................


// const forUser = async (req, res, next) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer ")
//     ) {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id).select("-password");

//       req.user = user;
//       return next(); // ✅ important
//     } else {
//       return res.status(401).json({ message: "No Token Found" }); // ✅ direct return
//     }
//   } catch (error) {
//     return res.status(401).json({ message: "Unauthorized Access" }); // ✅
//   }
// };



// const forAdmin = async (req, res, next) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer ")
//     ) {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.id).select("-password");

//       req.user = user;

//       if (user.isAdmin) {
//         return next(); // ✅
//       } else {
//         return res.status(401).json({
//           message: "Unauthorized Access! ONLY ADMIN",
//         });
//       }
//     } else {
//       return res.status(401).json({ message: "No Token Found" });
//     }
//   } catch (error) {
//     return res.status(401).json({ message: "Unauthorized Access" });
//   }
// };



// const protect = {forUser,forAdmin }

// export default protect