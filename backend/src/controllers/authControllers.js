import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";
import generateToken from "../middleware/generateToken.js";

export const handleRegister = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }
    let isAdmin = false;

    if(role === "admin"){
      isAdmin = true;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, isAdmin });

    await user.save();

    const token = generateToken(user._id, user.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on Vercel
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    const { password: _, ...safeUser } = user._doc;

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user._id, user.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on Vercel
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...safeUser } = user._doc;

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const handleAutoLogin = async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { password: _, ...safeUser } = user._doc;

  res.status(200).json({
    message: "User auto logged in successfully",
    user: safeUser,
  });
};
