import React, { useState } from "react";
import { foods } from "../utils/index.js";
import assets from "../assets/assets.js";

const Fruits = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleSlideClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div>
      {/* topic side  */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-800">
          Our Fresh Fruits
        </h3>
        <div className="w-[10vw] h-1 rounded-md bg-[#800020]"></div>
      </div>

      {/* Fruits list  */}
      <div className="flex items-start flex-wrap justify-start gap-4 mt-4">
        {foods.map((food, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center cursor-pointer ${
              activeIndex === index ? "border-[#800020]" : "border-gray-300"
            }`}
            onClick={() => handleSlideClick(index)}
          >
            <img
              className={`w-32 h-32 md:w-40 md:h-40 object-cover outline-none rounded-full border-4 ${
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
