import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("→ Error in protectRoute:", error.message);
    return res.status(500).json({ message: "Server error in authentication" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    
    const user = await User.findById(req.userId);
    console.log("Fetched User:", user); // Add this log

    if (user && user.isAdmin) {
      console.log("Accessed!!");
      next();
    } else {
      console.log("Access Denied! User is not an admin."); // Log reason
      return res.status(403).json({ message: "Access Denied!" });
    }
  } catch (err) {
    console.error("Error in requireAdmin:", err);
    return res.status(500).json({ message: "Error checking admin access" });
  }
};