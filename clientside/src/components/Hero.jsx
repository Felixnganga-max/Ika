import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Coffee,
  Utensils,
  Timer,
} from "lucide-react";
import assets from "../assets/assets.js";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const sliderImages = [
    assets.one,
    assets.two,
    assets.three,
    assets.four,
    assets.five,
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const navigateCarousel = (direction) => {
    if (direction === "next") {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    } else {
      setCurrentSlide(
        (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
      );
    }
  };

  return (
    <div className="relative w-full overflow-hidden min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white py-12 mt-16 px-6">
      {/* Subtle pattern background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url(${assets.foodPatternBg})`,
          backgroundSize: "250px",
          animation: "floatBackground 60s linear infinite",
        }}
      />

      {/* Decorative spice dots */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl"></div>
      <div className="absolute bottom-40 right-20 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-[#800020]/5 blur-xl"></div>

      {/* MAIN CONTAINER - Adjusted spacing here */}
      <div className="relative w-full max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-center">
        {/* Left Column - Content - Adjusted padding and spacing */}
        <div
          className={`lg:col-span-6 flex flex-col justify-center transition-all duration-1000 ${
            isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
          }`}
        >
          <motion.div
            className="flex items-center bg-gradient-to-r from-amber-100 to-orange-100 rounded-full py-2 px-4 w-fit mb-8 shadow-md"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <p className="text-lg font-semibold text-[#800020] mr-2">
              Culinary Excellence
            </p>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-lg">
              <img
                src={assets.logoImage}
                className="w-6 h-6 object-contain animate-spin-slow"
                alt="Logo"
              />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="block">Savor The</span>
            <span className="text-[#800020] relative inline-block">
              Flavor
              <motion.span
                className="absolute -right-8 -top-2 text-yellow-500 text-4xl"
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatType: "reverse",
                }}
              >
                ✨
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mt-6 relative leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            We bring the world's finest kitchen experiences to your home. Every
            dish is crafted with
            <span className="relative mx-2 font-semibold text-[#800020]">
              passion and artistry
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-300 animate-width-expand"></span>
            </span>
            for a truly memorable culinary journey.
          </motion.p>

          {/* Feature points */}
          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <Utensils className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-gray-700">Handcrafted by master chefs</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <Timer className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-gray-700">
                Premium ingredients, perfect timing
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <Coffee className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-gray-700">
                Elegant presentation, divine taste
              </p>
            </div>
          </motion.div>

          <motion.div
            className="mt-10 flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <motion.button
              className="relative bg-gradient-to-r from-[#800020] to-orange-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Explore Our Kitchen</span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-[#800020] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-8 transition-all duration-300">
                <ChevronRight className="w-5 h-5" />
              </span>
            </motion.button>

            <motion.a
              href="/menu"
              className="px-6 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:border-[#800020] hover:text-[#800020] transition-colors flex items-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Menu
            </motion.a>
          </motion.div>
        </div>

        {/* Right Column - Image Slider - Adjusted width and padding */}
        <motion.div
          className={`lg:col-span-6 transition-all duration-1000 ${
            isLoaded ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative h-screen max-h-[700px] w-full overflow-hidden rounded-3xl shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-br-full bg-orange-400/20 backdrop-blur-sm z-10"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 rounded-tl-full bg-[#800020]/20 backdrop-blur-sm z-10"></div>

            {/* Wooden spoon decorative element */}
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-amber-800/30 transform rotate-45 z-10 hidden md:block"></div>

            <AnimatePresence mode="wait">
              {sliderImages.map(
                (image, index) =>
                  index === currentSlide && (
                    <motion.div
                      key={index}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.7, ease: "easeOut" },
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        transition: { duration: 0.5 },
                      }}
                    >
                      <img
                        src={image}
                        alt={`Delicious food image ${index + 1}`}
                        className="w-full h-full object-contain object-center"
                        style={{ objectPosition: "center 30%" }}
                      />

                      {/* Enhanced gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-transparent"></div>

                      {/* Animated image shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shine-animation"></div>

                      {/* Decorative corner curves */}
                      <svg
                        className="absolute top-6 left-6 w-12 h-12 text-white/70 z-10 hidden md:block"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path d="M3 3h6m12 0v6M3 21h6m12 0v-6"></path>
                      </svg>
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            {/* Slider Controls - Enhanced */}
            <div className="absolute inset-0 flex items-center justify-between px-6">
              <motion.button
                onClick={() => navigateCarousel("prev")}
                className="w-14 h-14 rounded-full bg-white/10 border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all group overflow-hidden"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 15px rgba(255,255,255,0.5)",
                }}
                whileTap={{ scale: 0.92 }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#800020]/60 to-orange-500/60 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <ChevronLeft className="w-7 h-7 relative z-10" />
              </motion.button>
              <motion.button
                onClick={() => navigateCarousel("next")}
                className="w-14 h-14 rounded-full bg-white/10 border border-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all group overflow-hidden"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 15px rgba(255,255,255,0.5)",
                }}
                whileTap={{ scale: 0.92 }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#800020]/60 to-orange-500/60 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <ChevronRight className="w-7 h-7 relative z-10" />
              </motion.button>
            </div>

            {/* Enhanced Slider Indicators */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-4 z-20">
              {sliderImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`relative transition-all ${
                    index === currentSlide
                      ? "scale-100"
                      : "scale-85 opacity-70 hover:opacity-100"
                  }`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 ${
                      index === currentSlide
                        ? "bg-white border-white"
                        : "bg-transparent border-white/70"
                    }`}
                  ></div>
                  {index === currentSlide && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/50"
                      initial={{ scale: 1.8, opacity: 0.3 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Image number indicator */}
            <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 font-medium text-sm z-10">
              {currentSlide + 1} / {sliderImages.length}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes floatBackground {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 100% 100%;
          }
        }

        @keyframes width-expand {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
