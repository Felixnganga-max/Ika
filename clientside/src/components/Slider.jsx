import React, { useState, useEffect } from "react";
import { foods } from "../utils/index.js";

const Slider = () => {
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // If screen width < 768px, consider it mobile
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePlaceOrder = (food) => {
    setCart((prevCart) => [...prevCart, food]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full pt-20 bg-[#FAF7F0] relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {foods.map((food) => (
            <div
              key={food.id}
              className="flex flex-col items-center h-[420px] w-full max-w-[420px] mx-auto bg-white rounded-lg overflow-hidden border border-gray-300"
            >
              <div className="w-full h-[170px]">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-[#800020] w-[90%] -mt-16 z-10 p-6 rounded-lg text-white relative">
                <div className="absolute top-2 right-2 bg-[#FFD700] rounded-sm p-1 text-xl font-normal">
                  KSh. {food.price}
                </div>
                <h3 className="text-lg font-semibold mb-3">{food.name}</h3>
                <p className="text-sm">{food.description}</p>
              </div>

              <button
                onClick={() => handlePlaceOrder(food)}
                className="bg-[#800020] uppercase text-white py-3 px-8 rounded-full mt-4 hover:bg-[#600018] transition-colors duration-300"
              >
                Place Order
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal (Desktop: Right Sidebar, Mobile: Bottom Bar) */}
      <div
        className={`fixed ${
          isMobile
            ? "bottom-0 left-0 w-full h-[200px]" // Mobile: Bottom bar
            : "top-0 right-0 w-80 h-full" // Desktop: Right sidebar
        } bg-black bg-opacity-90 text-white transform ${
          isModalOpen
            ? "translate-x-0 translate-y-0"
            : isMobile
            ? "translate-y-full"
            : "translate-x-full"
        } transition-transform duration-300 ease-in-out p-6 overflow-y-auto z-[9999]`} // Super high z-index
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-xl font-bold"
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        {cart.length > 0 ? (
          <>
            <div
              className={`grid ${
                isMobile ? "grid-cols-2 gap-2" : "space-y-4"
              } overflow-hidden`}
            >
              {cart.map((food, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gray-800 p-2 rounded-md"
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-semibold">{food.name}</p>
                    <p className="text-[#FFD700] text-lg">KSh. {food.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-600 pt-2 text-lg">
              Total:{" "}
              <span className="text-[#FFD700] font-bold">
                KSh. {cart.reduce((total, food) => total + food.price, 0)}
              </span>
            </div>
          </>
        ) : (
          <p>No items in the cart.</p>
        )}
      </div>
    </div>
  );
};

export default Slider;
