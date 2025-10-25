import { generateToken } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (typeof password !== "string" || password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const foundUser = await User.findOne({ email });
    if (foundUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();
    return res.status(201).json({ message: "User registered" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const passwordMatched = await user.validatePassword(password);
    if (!passwordMatched)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = generateToken(user._id.toString());

    res.cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      domain: "localhost",
      secure: true,
      signed: true,
    });

    return res.status(200).json({ message: "User Login Successfull" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie(process.env.COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      secure: true,
      signed: true,
      path: "/",
    });

    res.json({ message: "User Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
