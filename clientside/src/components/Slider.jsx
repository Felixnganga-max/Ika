import React, { useState } from "react";
import { foods } from "../utils/index.js";

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleSlideClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="w-full pt-20 bg-[#FAF7F0]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 justify-center items-center md:grid-cols-3 gap-8">
          {foods.map((food, index) => (
            <div
              key={food.id}
              className={`flex flex-col items-center h-[420px] w-full max-w-[420px] mx-auto relative justify-between cursor-pointer bg-white rounded-lg overflow-hidden ${
                activeIndex === index
                  ? "border-2 border-[#800020] shadow-lg"
                  : "border border-gray-300"
              }`}
              onClick={() => handleSlideClick(index)}
            >
              <div className="w-full h-[170px]">
                <img
                  src={food.image}
                  alt={food.name}
                  className={`w-full h-full object-cover transition-shadow ${
                    activeIndex === index ? "shadow-lg" : ""
                  }`}
                />
              </div>

              <div className="bg-[#800020] w-[90%] -mt-16 z-10 p-6 rounded-lg text-white">
                <div className="absolute top-2 right-2 bg-[#FFD700] rounded-sm p-1 max-w-[40%] text-xl font-normal mb-2">
                  KSh. {food.price}
                </div>
                <h3 className="text-lg font-semibold mb-3">{food.name}</h3>
                <p className="text-sm mb-3">
                  {food.keyIngredients.map((ingredient, idx) => (
                    <span className="text-lg text-[#FFD700]" key={idx}>
                      {idx > 0 && " | "}
                      {ingredient}
                    </span>
                  ))}
                </p>
                <p className="text-sm leading-relaxed">{food.description}</p>
              </div>

              <button className="bg-[#800020] uppercase text-white py-3 px-8 rounded-full mb-6 hover:bg-[#600018] transition-colors duration-300">
                Place Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
