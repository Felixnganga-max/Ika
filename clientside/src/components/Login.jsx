import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import assets from "../assets/assets";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";

const Login = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      console.log("🚀 Starting login request...");

      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        {
          email: userEmail.trim(),
          password: password,
        }
      );

      console.log("🌐 Response Status:", response.status);
      console.log("📦 Complete Response:", response.data);

      const data = response.data;
      console.log("📦 Complete Response Data:", data);

      // Validate response structure
      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      // Enhanced token extraction with detailed logging
      console.log("🔍 Extracting token from user object...");
      console.log("🔍 data.user exists:", "user" in data);
      console.log("🔍 data.user value:", data.user);
      console.log(
        "🔍 data.user.accessToken exists:",
        data.user && "accessToken" in data.user
      );
      console.log("🔍 data.user.accessToken value:", data.user?.accessToken);
      console.log(
        "🔍 data.user.accessToken type:",
        typeof data.user?.accessToken
      );

      // Get token from user object
      const token = data.user?.accessToken;
      console.log("🎯 EXTRACTED TOKEN:", token);

      // More detailed validation
      if (!token) {
        console.error("❌ Token is falsy:", token);
        console.error("❌ Token type:", typeof token);
        console.error("❌ Available properties in data:", Object.keys(data));
        console.error(
          "❌ Available properties in data.user:",
          data.user ? Object.keys(data.user) : "user is null/undefined"
        );
        throw new Error("No access token received from server");
      }

      if (typeof token !== "string") {
        console.error("❌ Token is not a string:", typeof token);
        throw new Error("Invalid token format received");
      }

      if (token.length === 0) {
        console.error("❌ Token is empty string");
        throw new Error("Empty token received");
      }

      console.log("✅ Token validation passed!");
      console.log("✅ Token length:", token.length);
      console.log("✅ Token preview:", token.substring(0, 20) + "...");

      // Storage section with enhanced logging
      console.log("💾 Starting storage process...");

      // Clear existing data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      console.log("🗑️ Cleared existing storage");

      // Set new data with immediate verification
      console.log("💾 Setting token...");
      localStorage.setItem("token", token);

      // Immediate verification
      const immediateCheck = localStorage.getItem("token");
      console.log(
        "⚡ Immediate token check:",
        immediateCheck ? "SUCCESS" : "FAILED"
      );
      console.log("⚡ Immediate token length:", immediateCheck?.length);
      console.log("⚡ Tokens match:", token === immediateCheck);

      // Store user data
      if (data.user && typeof data.user === "object") {
        console.log("👤 Storing user data...");
        localStorage.setItem("user", JSON.stringify(data.user));

        const storedUser = localStorage.getItem("user");
        console.log("👤 User stored successfully:", !!storedUser);
      }

      // Note: refreshToken is no longer returned from backend
      console.log("🔄 RefreshToken not stored (not returned from backend)");

      // Final verification
      const finalTokenCheck = localStorage.getItem("token");
      const finalUserCheck = localStorage.getItem("user");

      console.log("🏁 FINAL STORAGE VERIFICATION:");
      console.log("🏁 Token stored:", !!finalTokenCheck);
      console.log("🏁 User stored:", !!finalUserCheck);
      console.log("🏁 Token length:", finalTokenCheck?.length);
      console.log("🏁 Original vs Stored match:", token === finalTokenCheck);

      if (!finalTokenCheck) {
        console.error(
          "❌ CRITICAL: Token not found in localStorage after setting!"
        );
        throw new Error("Failed to store token in localStorage");
      }

      // Clear form
      setUserEmail("");
      setPassword("");

      console.log("🎉 LOGIN SUCCESS! Redirecting...");

      // Navigate to home
      navigate("/");
    } catch (err) {
      console.error("❌ Login Error:", err);

      // Handle axios errors specifically
      if (err.response) {
        // Server responded with error status
        const errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
        setError(errorMessage);
        console.error("❌ Server Error:", err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        setError("Unable to connect to server. Please check your connection.");
        console.error("❌ Network Error:", err.request);
      } else {
        // Something else happened
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && userEmail.trim() && password.trim()) {
      handleSubmit();
    }
  };

  const debugLocalStorage = () => {
    console.group("🔧 LocalStorage Debug");
    console.log("All keys:", Object.keys(localStorage));
    console.log("Token exists:", !!localStorage.getItem("token"));
    console.log("Token value:", localStorage.getItem("token"));
    console.log("Token length:", localStorage.getItem("token")?.length);
    console.log("User exists:", !!localStorage.getItem("user"));
    console.log("User value:", localStorage.getItem("user"));
    console.log("RefreshToken exists:", !!localStorage.getItem("refreshToken"));

    // Test if token is valid JWT format
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token starts with 'eyJ':", token.startsWith("eyJ"));
      console.log("Token parts count:", token.split(".").length);
    }
    console.groupEnd();
  };

  const testLocalStorage = () => {
    console.log("🧪 Testing localStorage...");

    // Test basic functionality
    localStorage.setItem("test", "hello");
    const testValue = localStorage.getItem("test");
    console.log("🧪 Basic test:", testValue === "hello" ? "PASS" : "FAIL");

    // Test with your actual token
    const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";
    localStorage.setItem("testToken", testToken);
    const retrievedToken = localStorage.getItem("testToken");
    console.log(
      "🧪 Token test:",
      retrievedToken === testToken ? "PASS" : "FAIL"
    );

    // Cleanup
    localStorage.removeItem("test");
    localStorage.removeItem("testToken");
  };

  const isFormValid = userEmail.trim() && password.trim();

  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      <img
        src={assets.loginImage}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt="Login background"
      />

      <div className="gap-6 flex flex-col items-center bg-[rgba(256,256,256,0.4)] w-[80%] md:w-[500px] h-full z-10 backdrop-blur-md p-4 px-4 py-12">
        <p className="text-headingColor text-3xl font-semibold">Sign in</p>

        {error && (
          <div className="text-red-500 bg-red-100 px-4 py-2 rounded-lg w-full text-center border border-red-300">
            {error}
          </div>
        )}

        <div className="w-full">
          <label className="text-textColor text-sm font-medium mb-2 block">
            Email
          </label>
          <div className="flex items-center gap-4 bg-lightOverlay backdrop-blur-md rounded-md px-4 py-2">
            <HiOutlineMail className="text-textColor text-2xl flex-shrink-0" />
            <input
              type="email"
              className="w-full h-full bg-transparent text-textColor outline-none border-none placeholder:text-gray-500"
              placeholder="Enter your email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="w-full">
          <label className="text-textColor text-sm font-medium mb-2 block">
            Password
          </label>
          <div className="flex items-center gap-4 bg-lightOverlay backdrop-blur-md rounded-md px-4 py-2">
            <HiOutlineLockClosed className="text-textColor text-2xl flex-shrink-0" />
            <input
              type="password"
              className="w-full h-full bg-transparent text-textColor outline-none border-none placeholder:text-gray-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
        </div>

        <motion.button
          onClick={() => {
            console.log("🖱️ BUTTON CLICKED!");
            handleSubmit();
          }}
          {...buttonClick}
          disabled={loading || !isFormValid}
          className={`w-full px-4 py-2 rounded-lg bg-[#800020] cursor-pointer text-white text-xl capitalize hover:bg-[#600010] transition-all duration-150 ${
            loading || !isFormValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing In..." : "Sign In"}
        </motion.button>

        <p className="text-textColor text-sm">
          Don't have an account?{" "}
          <span
            className="text-[#800020] cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Sign up here
          </span>
        </p>

        {/* Debug buttons - remove in production */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={debugLocalStorage}
            className="text-xs underline text-gray-600 hover:text-gray-800"
            type="button"
          >
            Debug localStorage
          </button>
          <button
            onClick={testLocalStorage}
            className="text-xs underline text-blue-600 hover:text-blue-800"
            type="button"
          >
            Test localStorage
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
