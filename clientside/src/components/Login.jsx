import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import LoginInput from "./LoginInput";
import { HiOutlineMail } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { buttonClick } from "../animations";

const Login = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!userEmail || !password || (isSignUp && !name)) {
      setError("Please fill in all fields");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignUp
        ? "http://localhost:4000/api/user/register"
        : "http://localhost:4000/api/user/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          password: password,
          ...(isSignUp && { name }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setUserEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      <img
        src={assets.loginImage}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt=""
      />
      <div className="gap-6 flex flex-col items-center bg-[rgba(256,256,256,0.4)] w-[80%] md:w-[500px] h-full z-10 backdrop-blur-md p-4 px-4 py-12">
        <p className="text-headingColor text-3xl font-semibold">
          {isSignUp ? "Create Account" : "Sign in"}
        </p>
        {error && (
          <p className="text-red-500 bg-red-100 px-4 py-2 rounded-lg w-full text-center">
            {error}
          </p>
        )}

        {isSignUp && (
          <LoginInput
            placeHolder={"Full Name"}
            icon={<HiOutlineMail />}
            inputState={name}
            inputStateFunc={setName}
            type="text"
            isSignUp={isSignUp}
          />
        )}

        <LoginInput
          placeHolder={"Email Here"}
          icon={<HiOutlineMail />}
          inputState={userEmail}
          inputStateFunc={setUserEmail}
          type="email"
          isSignUp={isSignUp}
        />

        <LoginInput
          placeHolder={"Password Here"}
          icon={<HiOutlineMail />}
          inputState={password}
          inputStateFunc={setPassword}
          type="password"
          isSignUp={isSignUp}
        />

        {isSignUp && (
          <LoginInput
            placeHolder={"Confirm Password"}
            icon={<HiOutlineMail />}
            inputState={confirmPassword}
            inputStateFunc={setConfirmPassword}
            type="password"
            isSignUp={isSignUp}
          />
        )}

        <motion.button
          onClick={handleSubmit}
          {...buttonClick}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg bg-[#800020] cursor-pointer text-white text-xl capitalize hover:bg-[#600010] transition-all duration-150 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
        </motion.button>

        <p>
          {isSignUp ? "Already have an account: " : "Doesn't have an account: "}
          <motion.button
            onClick={() => setIsSignUp(!isSignUp)}
            {...buttonClick}
            className="text-[#800020] underline cursor-pointer bg-transparent"
          >
            {isSignUp ? "Sign In" : "Create Account"}
          </motion.button>
        </p>
      </div>
    </div>
  );
};

export default Login;
