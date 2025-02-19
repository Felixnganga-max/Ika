import React, { useState } from "react";
import { foods } from "../utils/index.js";
import assets from "../assets/assets.js";

const Fruits = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleSlideClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="ml-5">
      {/* topic side  */}
      <div className="text-center md:text-left">
        <h3 className="mt-10 md:text-2xl text-lg font-semibold text-gray-800">
          Our Fresh Fruits
        </h3>
        <div className="w-[20vw] h-1 rounded-md bg-[#800020] mx-auto md:mx-0"></div>
      </div>

      {/* Fruits list  */}
      <div className="flex items-center md:items-start flex-wrap justify-center md:justify-start gap-4 mt-4">
        {foods.map((food, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center cursor-pointer ${
              activeIndex === index ? "border-[#800020]" : "border-gray-300"
            }`}
            onClick={() => handleSlideClick(index)}
          >
            <img
              className={`w-28 h-28 md:w-32 md:h-32 object-cover outline-none rounded-full border-4 ${
                activeIndex === index
                  ? "border-[#800020] shadow-lg"
                  : "border-gray-100"
              }`}
              src={food.image}
            />
            <h4>{food.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fruits;
