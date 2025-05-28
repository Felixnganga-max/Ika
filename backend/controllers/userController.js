import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

// Token generation functions
const createAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "default-secret", {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  });
};

const createRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET || "default-refresh-secret",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};

// Account lockout constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

// Register User
const registerUser = async (req, res) => {
  const { name, password, email, role = "user" } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if user exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Additional password validation
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 1 uppercase, 1 lowercase, and 1 number",
      });
    }

    // Validate role
    const validRoles = ["admin", "staff", "user"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create refresh token
    const refreshToken = createRefreshToken(null); // Will update after user creation
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
      refreshTokens: [],
    });

    const user = await newUser.save();

    // Create tokens with user ID
    const accessToken = createAccessToken(user._id, user.role);
    const newRefreshToken = createRefreshToken(user._id);

    // Store refresh token
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: refreshTokenExpiry,
    });
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({
        success: false,
        message:
          "Account is temporarily locked due to multiple failed login attempts",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Verify password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;

      // Lock account if max attempts reached
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        user.loginAttempts = 0;
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();

    // Clean up old/expired refresh tokens
    user.refreshTokens = user.refreshTokens.filter(
      (tokenObj) => tokenObj.expiresAt > new Date() && tokenObj.isActive
    );

    // Create new tokens
    const accessToken = createAccessToken(user._id, user.role);
    const refreshToken = createRefreshToken(user._id);
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: refreshTokenExpiry,
    });

    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and check if refresh token exists and is valid
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check if refresh token exists in user's tokens
    const tokenIndex = user.refreshTokens.findIndex(
      (tokenObj) =>
        tokenObj.token === refreshToken &&
        tokenObj.isActive &&
        tokenObj.expiresAt > new Date()
    );

    if (tokenIndex === -1) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Create new access token
    const newAccessToken = createAccessToken(user._id, user.role);

    res.json({
      success: true,
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Logout User
const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;
  const userId = req.user?.id;

  try {
    if (userId) {
      const user = await userModel.findById(userId);
      if (user && refreshToken) {
        // Mark specific refresh token as inactive
        const tokenIndex = user.refreshTokens.findIndex(
          (tokenObj) => tokenObj.token === refreshToken
        );

        if (tokenIndex !== -1) {
          user.refreshTokens[tokenIndex].isActive = false;
          await user.save();
        }
      }
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Logout from all devices
const logoutAllDevices = async (req, res) => {
  const userId = req.user?.id;

  try {
    if (userId) {
      const user = await userModel.findById(userId);
      if (user) {
        // Mark all refresh tokens as inactive
        user.refreshTokens.forEach((tokenObj) => {
          tokenObj.isActive = false;
        });
        await user.save();
      }
    }

    res.json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.error("Logout All Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .select("-password -refreshTokens");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Current User Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  loginUser,
  registerUser,
  refreshToken,
  logoutUser,
  logoutAllDevices,
  getCurrentUser,
};
