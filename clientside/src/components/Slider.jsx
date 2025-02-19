import React, { useState, useEffect } from "react";
import { foods } from "../utils/index.js";
import { motion, AnimatePresence } from "framer-motion";

const Slider = () => {
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePlaceOrder = (food) => {
    // Add vibration feedback on mobile
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    setCart((prevCart) => [...prevCart, food]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRemoveFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full pt-20 bg-gradient-to-b from-[#FAF7F0] to-[#FFF5E6] min-h-screen relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#800020] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FFD700] opacity-20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#800020]">
          <span className="relative">
            Our Special Menu
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#800020] to-[#FFD700] rounded-full"></span>
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {foods.map((food) => (
            <motion.div
              key={food.id}
              className="relative flex flex-col items-center h-auto w-full max-w-[420px] mx-auto rounded-xl overflow-hidden group"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              onHoverStart={() => setActiveCard(food.id)}
              onHoverEnd={() => setActiveCard(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Glass backdrop */}
              <div className="absolute inset-0 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl z-0"></div>

              {/* Food Image */}
              <div className="w-full h-[200px] relative overflow-hidden rounded-t-xl">
                <motion.img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Badge price */}
                <motion.div
                  className="absolute top-4 right-4 bg-[#FFD700] text-[#800020] rounded-full px-3 py-1 font-bold shadow-lg z-10"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  KSh. {food.price}
                </motion.div>
              </div>

              {/* Food Details with glass effect */}
              <div className="w-[92%] -mt-16 z-10 p-6 rounded-xl text-white relative backdrop-blur-md bg-gradient-to-r from-[#800020]/80 to-[#600018]/80 border border-white/10 shadow-lg">
                <h3 className="text-xl font-bold mb-3">{food.name}</h3>
                <p className="text-sm text-white/90">{food.description}</p>

                {/* Icons for food attributes */}
                <div className="flex mt-2 space-x-2">
                  {food.spicy && (
                    <span className="text-[#FFD700] text-xs bg-white/10 px-2 py-1 rounded-full">
                      🌶️ Spicy
                    </span>
                  )}
                  {food.vegetarian && (
                    <span className="text-green-300 text-xs bg-white/10 px-2 py-1 rounded-full">
                      🥦 Veg
                    </span>
                  )}
                </div>
              </div>

              {/* Animated order button */}
              <motion.button
                onClick={() => handlePlaceOrder(food)}
                className="mt-6 mb-6 bg-gradient-to-r from-[#800020] to-[#600018] uppercase text-white py-3 px-8 rounded-full shadow-lg relative overflow-hidden group z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Add to Order</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#FFA500] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4 }}
                ></motion.span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Cart Modal with glass morphism */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            />

            <motion.div
              className={`fixed ${
                isMobile
                  ? "bottom-0 left-0 w-full max-h-[80vh]" // Mobile: Bottom sheet
                  : "top-0 right-0 w-96 h-full" // Desktop: Right sidebar
              } bg-black/70 backdrop-blur-xl text-white rounded-t-2xl md:rounded-l-2xl p-6 overflow-y-auto z-[9999] border-l border-t border-white/20`}
              initial={{
                x: isMobile ? 0 : "100%",
                y: isMobile ? "100%" : 0,
              }}
              animate={{
                x: 0,
                y: 0,
              }}
              exit={{
                x: isMobile ? 0 : "100%",
                y: isMobile ? "100%" : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#FFD700] bg-clip-text text-transparent">
                  Order Summary
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                >
                  ✖
                </button>
              </div>

              {/* Pill handle for mobile drag indicator */}
              {isMobile && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white/30 rounded-full mb-6"></div>
              )}

              {cart.length > 0 ? (
                <>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((food, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4 bg-white/10 p-3 rounded-xl hover:bg-white/15 transition-colors duration-200 border border-white/10 group relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                        <div className="flex-1">
                          <p className="text-base font-semibold">{food.name}</p>
                          <p className="text-[#FFD700] text-lg font-bold">
                            KSh. {food.price}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="mt-6 border-t border-white/20 pt-4 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between mb-4">
                      <span>Subtotal:</span>
                      <span className="text-[#FFD700] font-bold">
                        KSh.{" "}
                        {cart.reduce((total, food) => total + food.price, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-4 text-sm">
                      <span>Delivery Fee:</span>
                      <span>KSh. 150</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total:</span>
                      <span className="text-[#FFD700]">
                        KSh.{" "}
                        {cart.reduce((total, food) => total + food.price, 0) +
                          150}
                      </span>
                    </div>

                    <motion.button
                      className="w-full mt-6 py-4 bg-gradient-to-r from-[#800020] to-[#600018] rounded-xl text-white font-bold uppercase shadow-lg relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">Checkout Now</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-orange-500 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        initial={{ y: "100%" }}
                        whileHover={{ y: 0 }}
                        transition={{ duration: 0.4 }}
                      ></motion.div>
                    </motion.button>
                  </motion.div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl mb-4"
                  >
                    🍽️
                  </motion.div>
                  <p className="text-center text-white/70">
                    Your cart is empty.
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="mt-4 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-200"
                  >
                    Browse Menu
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating cart button */}
      {cart.length > 0 && !isModalOpen && (
        <motion.button
          className="fixed bottom-6 right-6 bg-[#800020] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <span className="text-xl">🛒</span>
          <span className="absolute -top-2 -right-2 bg-[#FFD700] text-[#800020] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            {cart.length}
          </span>
        </motion.button>
      )}
    </div>
  );
};

export default Slider;
