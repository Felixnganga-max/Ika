import React from "react";
import { motion } from "framer-motion";
import Slider from "./Slider";

const HomeSlider = () => {
  return (
    <motion.div className="w-full flex items-center justify-center flex-col m-auto">
      <div className="w-full flex items-center justify-between">
        {/* Header Section */}
        <div className="">
          <p className="text-2xl text-gray-800 font-bold">
            Your Favorite & Yummy Snacks
          </p>
          <div className="w-[10vw] h-1 rounded-md bg-[#800020]"></div>
        </div>
      </div>

      {/* Slider Component */}
      <div className="w-full">
        <Slider />
      </div>
    </motion.div>
  );
};

export default HomeSlider;
