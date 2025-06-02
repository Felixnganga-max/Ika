import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import assets from "../assets/assets";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";

// Enhanced Input Component
const AuthInput = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon: IconComponent,
  disabled,
  onKeyPress,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword = false,
}) => {
  return (
    <div className="w-full">
      <label className="text-textColor text-sm font-medium mb-2 block">
        {label}
      </label>
      <div className="flex items-center gap-4 bg-lightOverlay backdrop-blur-md rounded-md px-4 py-2 border border-white/20 focus-within:border-[#800020] transition-colors">
        <IconComponent className="text-textColor text-2xl flex-shrink-0" />
        <input
          type={
            showPasswordToggle ? (showPassword ? "text" : "password") : type
          }
          className="w-full h-full bg-transparent text-textColor outline-none border-none placeholder:text-gray-500"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          disabled={disabled}
          autoComplete={
            type === "email"
              ? "email"
              : type === "password"
              ? "current-password"
              : "name"
          }
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="text-textColor hover:text-[#800020] transition-colors"
            disabled={disabled}
          >
            {showPassword ? (
              <HiOutlineEyeOff className="text-xl" />
            ) : (
              <HiOutlineEye className="text-xl" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();

  // Form states
  const [isSignUp, setIsSignUp] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Success state
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    if (!userEmail.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError("Full name is required");
        return false;
      }

      if (name.trim().length < 2) {
        setError("Name must be at least 2 characters long");
        return false;
      }

      if (!confirmPassword) {
        setError("Please confirm your password");
        return false;
      }

      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignUp
        ? "https://ika-cua5-backend.vercel.app/api/user/register"
        : "https://ika-cua5-backend.vercel.app/api/user/login";

      console.log(
        `🚀 Starting ${isSignUp ? "registration" : "login"} request...`
      );

      const requestData = {
        email: userEmail.trim(),
        password: password,
        ...(isSignUp && { name: name.trim() }),
      };

      const response = await axios.post(endpoint, requestData);

      console.log("🌐 Response Status:", response.status);
      console.log("📦 Complete Response:", response.data);

      const data = response.data;

      // Validate response structure
      if (!data.success) {
        throw new Error(
          data.message || `${isSignUp ? "Registration" : "Login"} failed`
        );
      }

      if (isSignUp) {
        // Registration success - show success message and switch to login
        setSuccessMessage("Account created successfully! You can now sign in.");
        setIsSignUp(false);
        setPassword("");
        setConfirmPassword("");
        setName("");
        console.log("🎉 REGISTRATION SUCCESS!");
        return;
      }

      // Login flow - same as before
      console.log("🔍 Extracting token from user object...");
      const token = data.user?.accessToken;

      if (!token) {
        console.error("❌ No access token received");
        throw new Error("No access token received from server");
      }

      if (typeof token !== "string" || token.length === 0) {
        console.error("❌ Invalid token format");
        throw new Error("Invalid token format received");
      }

      console.log("✅ Token validation passed!");

      // Clear existing data and store new data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      localStorage.setItem("token", token);

      if (data.user && typeof data.user === "object") {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Final verification
      const finalTokenCheck = localStorage.getItem("token");
      if (!finalTokenCheck) {
        throw new Error("Failed to store token in localStorage");
      }

      // Clear form
      clearForm();

      console.log("🎉 LOGIN SUCCESS! Redirecting...");

      // Check if user is admin and redirect accordingly
      if (data.user && data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(`❌ ${isSignUp ? "Registration" : "Login"} Error:`, err);

      if (err.response) {
        const errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
        setError(errorMessage);
      } else if (err.request) {
        setError("Unable to connect to server. Please check your connection.");
      } else {
        setError(
          err.message ||
            `${isSignUp ? "Registration" : "Login"} failed. Please try again.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setUserEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleModeSwitch = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccessMessage("");
    clearForm();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && isFormValid) {
      handleSubmit();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const isFormValid =
    userEmail.trim() &&
    password.trim() &&
    (!isSignUp || (name.trim() && confirmPassword));

  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      <img
        src={assets.loginImage}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt="Login background"
      />

      <div className="gap-6 flex flex-col items-center bg-[rgba(256,256,256,0.4)] w-[80%] md:w-[500px] h-full z-10 backdrop-blur-md p-4 px-4 py-12 overflow-y-auto">
        {/* Welcome Header */}
        <div className="text-center mb-2">
          <h1 className="text-4xl md:text-5xl font-bold text-[#800020] tracking-tight mb-2">
            Ika <span className="text-[#ffd700]">Fries</span>
          </h1>
          <p className="text-textColor text-lg">
            {getGreeting()}!{" "}
            {isSignUp ? "Join our delicious community" : "Welcome back"}
          </p>
        </div>

        <p className="text-headingColor text-3xl font-semibold">
          {isSignUp ? "Create Account" : "Sign in"}
        </p>

        {/* Success Message */}
        {successMessage && (
          <div className="text-green-600 bg-green-100 px-4 py-3 rounded-lg w-full text-center border border-green-300">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 bg-red-100 px-4 py-3 rounded-lg w-full text-center border border-red-300">
            {error}
          </div>
        )}

        {/* Name Field - Only for Sign Up */}
        {isSignUp && (
          <AuthInput
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={HiOutlineUser}
            disabled={loading}
            onKeyPress={handleKeyPress}
          />
        )}

        {/* Email Field */}
        <AuthInput
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          icon={HiOutlineMail}
          disabled={loading}
          onKeyPress={handleKeyPress}
        />

        {/* Password Field */}
        <AuthInput
          label="Password"
          type="password"
          placeholder={
            isSignUp
              ? "Create a password (min. 6 characters)"
              : "Enter your password"
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={HiOutlineLockClosed}
          disabled={loading}
          onKeyPress={handleKeyPress}
          showPasswordToggle={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        {/* Confirm Password Field - Only for Sign Up */}
        {isSignUp && (
          <AuthInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={HiOutlineLockClosed}
            disabled={loading}
            onKeyPress={handleKeyPress}
            showPasswordToggle={true}
            showPassword={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />
        )}

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          {...buttonClick}
          disabled={loading || !isFormValid}
          className={`w-full px-4 py-3 rounded-lg bg-[#800020] cursor-pointer text-white text-xl capitalize hover:bg-[#600010] transition-all duration-150 font-medium ${
            loading || !isFormValid
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-lg"
          }`}
        >
          {loading
            ? isSignUp
              ? "Creating Account..."
              : "Signing In..."
            : isSignUp
            ? "Create Account"
            : "Sign In"}
        </motion.button>

        {/* Mode Switch */}
        <p className="text-textColor text-sm text-center">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-[#800020] cursor-pointer hover:underline font-medium transition-colors hover:text-[#600010]"
            onClick={handleModeSwitch}
          >
            {isSignUp ? "Sign in here" : "Sign up here"}
          </span>
        </p>

        {/* Additional Info for Sign Up */}
        {isSignUp && (
          <div className="text-xs text-gray-600 text-center px-4">
            <p>
              By creating an account, you agree to our terms of service and
              privacy policy.
            </p>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-[#800020] hover:text-[#600010] underline transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
