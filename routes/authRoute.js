import express from "express";
import { register, login } from "../controller/authController.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimited.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verifyToken.js";
import User from "../models/User.js"; // ✅ Add this import!

const router = express.Router();

// Registration and Login
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

// Authenticated user info
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Error in /me route:", error); // Optional: for debugging
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
