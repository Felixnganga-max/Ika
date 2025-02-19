import React from "react";
import { motion } from "framer-motion";
import assets from "../assets/assets.js";
import { buttonClick, staggerFadeInout } from "../animations";
import { foods } from "../utils/index.js";

const Hero = () => {
  return (
    <motion.div className="w-[99%] grid grid-cols-1 mt-8 md:grid-cols-2 gap-4">
      {/* Stuff on the left */}
      <div className="ml-8">
        <div className="px-4 py-1 flex items-center justify-around gap-2 bg-orange-100 rounded-full w-full md:w-[50%]">
          <p className="text-lg font-semibold text-[#800020]">
            Fast, affordable and safe delivery
          </p>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 shadow-md">
            <img
              src={assets.logoImage}
              className="w-full h-full object-contain"
              alt="Logo"
            />
          </div>
        </div>
        <p className="text-[30px] text-gray-600 md:text-[65px] font-semibold md:font-extrabold tracking-tight mt-10">
          Delivery or takeaway food <br />
          <span className="text-[#800020]">Fresh and Fast</span>
        </p>
        <p className="text-gray-700 text-lg mt-30">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempore, cum
          molestias! Itaque quibusdam possimus tempore adipisci iure sed dolorem
          modi quod veniam autem! Deserunt ipsa praesentium harum, quam et
          neque.
        </p>
        <motion.button
          {...buttonClick}
          className="bg-gradient-to-bl from-orange-400 to-orange-600 px-4 py-2 rounded-xl text-blck text-base font-semibold mt-10"
        >
          Order Now
        </motion.button>
      </div>

      {/* Stuff on the Right */}
      <div className="flex flex-1 py-2 items-center justify-center relative">
        <img
          className="absolute top-0 right-0 md:right-20 w-full h-420 md:w-auto md:h-650"
          alt="Background"
          src={assets.heroBg}
        />
        <div className="w-full md:w-[460px] ml-0 flex flex-wrap justify-center items-start gap-4 gap-y-14">
          {foods &&
            foods.map((item, index) => (
              <motion.div
                key={index}
                {...staggerFadeInout(index)}
                className="w-28 h-28 md:w-[150px] p-4 bg-white/50 backdrop-blur-md rounded-xl flex flex-col items-center justify-center drop-shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[70%] h-[100px] object-cover rounded-lg md:-mt-10"
                />
                <p className="text-sm lg:text-xl font-semibold text-gray-800">
                  {item.name}
                </p>
                <p className="text-[12px] text-lg font-semibold text-gray-400 capitalize">
                  {item.category}
                </p>
                <p className="text-sm text-gray-800 font-semibold">
                  <span className="text-[#800020]">KSh. </span> {item.price}
                </p>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
