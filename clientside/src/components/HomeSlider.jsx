import React from "react";
import { motion } from "framer-motion";
import Slider from "./Slider";

const HomeSlider = () => {
  return (
    <motion.div
      id="menu-section"
      className="w-full flex items-center justify-center flex-col m-auto pt-16"
    >
      {/* Slider Component */}
      <div className="w-full">
        <Slider />
      </div>
    </motion.div>
  );
};

export default HomeSlider;
