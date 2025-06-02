import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Coffee,
  Utensils,
  Timer,
  Star,
  Sparkles,
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
    }, 6000);
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

  const handleExploreClick = () => {
    // Smooth scroll to next section (adjust selector as needed)
    const nextSection = document.querySelector(
      '#menu-section, .menu-section, [data-section="menu"]'
    );
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fallback: scroll down by viewport height
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {sliderImages.map(
            (image, index) =>
              index === currentSlide && (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 1 },
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                >
                  <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat filter brightness-60"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center 40%",
                    }}
                  />

                  {/* Simplified Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#800020]/60 via-transparent to-transparent" />

                  {/* Simple Floating Particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-yellow-300 text-2xl"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${20 + i * 10}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeInOut",
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 mt-16 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left Column - Main Content */}
          <motion.div
            className={`flex flex-col justify-center transition-all duration-1000 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-32 opacity-0"
            }`}
          >
            {/* Simple Badge */}
            <motion.div
              className="flex items-center bg-gradient-to-r from-amber-100/90 to-orange-100/90 backdrop-blur-sm rounded-full py-3 px-6 w-fit mb-8 shadow-lg border border-white/20"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Sparkles className="w-5 h-5 text-[#800020] mr-2" />
              <p className="text-lg font-bold text-[#800020] mr-3">
                Culinary Excellence
              </p>
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg">
                <img
                  src={assets.logoImage}
                  className="w-7 h-7 object-contain"
                  alt="Logo"
                />
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="block text-white drop-shadow-lg">Savor The</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-lg">
                Flavor
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl text-white/90 leading-relaxed mb-10 font-medium drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              We bring exceptional culinary experiences to your table. Every
              dish is crafted with
              <span className="font-bold text-yellow-300 mx-1">
                passion and care
              </span>
              for a truly memorable dining experience.
            </motion.p>

            {/* Feature Points */}
            <motion.div
              className="space-y-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {[
                {
                  icon: Utensils,
                  text: "Expertly crafted dishes",
                  color: "from-amber-400 to-yellow-500",
                },
                {
                  icon: Timer,
                  text: "Fresh ingredients, perfect timing",
                  color: "from-orange-400 to-red-500",
                },
                {
                  icon: Coffee,
                  text: "Exceptional taste and presentation",
                  color: "from-red-400 to-pink-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mr-4 shadow-lg`}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg text-white/90 font-medium">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <motion.button
                onClick={handleExploreClick}
                className="bg-gradient-to-r from-[#800020] to-red-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">🍽️</span>
                Explore Our Kitchen
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.button>

              <motion.a
                href="/menu"
                className="px-8 py-4 rounded-full border-2 border-white/90 text-white font-bold text-lg hover:bg-white hover:text-[#800020] transition-all flex items-center justify-center backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-5 h-5 mr-2" />
                View Menu
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Simple Rating Card */}
          <motion.div
            className="hidden lg:flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-white font-bold text-lg">Exceptional Taste</p>
              <p className="text-white/80">Loved by our customers</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-8 z-20 pointer-events-none">
        <motion.button
          onClick={() => navigateCarousel("prev")}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={() => navigateCarousel("next")}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center space-x-4 z-20">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-24 right-8 bg-black/20 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full text-white font-bold z-20">
        {String(currentSlide + 1).padStart(2, "0")} /{" "}
        {String(sliderImages.length).padStart(2, "0")}
      </div>
    </div>
  );
};

export default Hero;
