import React, { useState } from "react";
import assets from "../assets/assets";
import LoginInput from "./LoginInput";
import { HiOutlineMail } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { motion } from "framer-motion";
import { buttonClick } from "../animations";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (!userEmail || !password) {
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      return;
    }
    console.log("Form submitted:", { userEmail, isSignUp });
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden flex">
      {/* background Image  */}
      <img
        src={assets.loginImage}
        className="w-full h-full object-cover absolute top-0 left-0"
        alt=""
      />
      {/* content box  */}
      <div className="gap-6 flex flex-col items-center bg-[rgba(256,256,256,0.4)] w-[80%] md:w-[500px] h-full z-10 backdrop-blur-md p-4 px-4 py-12">
        {/* logo   */}
        <div className="flex items-center justify-start gap-4 w-full">
          <img src={assets.logoImage} alt="" className="w-20 h-20" />
          <p className="text-headingColor font-semibold text-3xl">Kikuyu</p>
        </div>

        {/* Welcome text  */}
        <p className="text-headingColor text-3xl font-semibold">
          Enjoy Greatness
        </p>
        <p className="text-xl text-textColor">
          {isSignUp ? "Create Account" : "Sign in"} with the following
        </p>

        {/* Google Sign In Button */}
        <motion.div
          {...buttonClick}
          onClick={handleGoogleSignIn}
          className="w-full px-4 md:px-12 py-4"
        >
          <div className="flex items-center justify-center gap-3 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer shadow-md transition-all duration-150 backdrop-blur-md">
            <FcGoogle className="text-2xl" />
            <p className="text-base text-headingColor">
              {isSignUp ? "Sign up" : "Sign in"} with Google
            </p>
          </div>
        </motion.div>

        <div className="flex items-center w-full px-4 md:px-12">
          <div className="flex-1 h-[1px] bg-gray-400"></div>
          <p className="text-gray-400 px-2">OR</p>
          <div className="flex-1 h-[1px] bg-gray-400"></div>
        </div>

        {/* Input Section */}
        <div className="w-full flex flex-col items-center justify-center gap-6 px-4 md:px-12 py-4">
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

          {/* Action Button */}
          <motion.button
            onClick={handleSubmit}
            {...buttonClick}
            className="w-full px-4 py-2 rounded-lg bg-[#800020] cursor-pointer text-white text-xl capitalize hover:bg-[#600010] transition-all duration-150"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </motion.button>

          {/* Toggle Sign In/Sign Up */}
          {!isSignUp ? (
            <p>
              Doesn't have an account:{" "}
              <motion.button
                onClick={() => setIsSignUp(true)}
                {...buttonClick}
                className="text-[#800020] underline cursor-pointer bg-transparent"
              >
                Create Account
              </motion.button>{" "}
            </p>
          ) : (
            <p>
              Already have an account:{" "}
              <motion.button
                onClick={() => setIsSignUp(false)}
                {...buttonClick}
                className="text-[#800020] underline cursor-pointer bg-transparent"
              >
                Sign In
              </motion.button>{" "}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
