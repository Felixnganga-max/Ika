import express from "express";
import {
  loginUser,
  registerUser,
  refreshToken,
  logoutUser,
  logoutAllDevices,
  getCurrentUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh-token", refreshToken);

// Protected routes (require authentication)
userRouter.post("/logout", logoutUser);
userRouter.post("/logout-all", logoutAllDevices);
userRouter.get("/profile", getCurrentUser);

export default userRouter;
