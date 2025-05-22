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

  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Background Image Slider with Enhanced Animations */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {sliderImages.map(
            (image, index) =>
              index === currentSlide && (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{
                    opacity: 0,
                    scale: 1.05,
                    rotateY: 10,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 0.95,
                    rotateY: 0,
                    transition: {
                      duration: 1.2,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      scale: { duration: 12, ease: "easeInOut" },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    rotateY: -10,
                    transition: { duration: 0.8 },
                  }}
                >
                  <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat filter brightness-60 contrast-125 saturate-125 hue-rotate-15"
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center 40%",
                    }}
                  />

                  {/* Multi-layered Gradient Overlays */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1 }}
                  />

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-[#800020]/70 via-transparent to-amber-900/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1.5 }}
                  />

                  <motion.div
                    className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/20 to-black/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 2 }}
                  />

                  {/* Enhanced Dynamic Light Effects */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-orange-300/20 to-transparent"
                    animate={{
                      x: ["100%", "-100%"],
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatDelay: 4,
                      delay: 2,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Enhanced Floating Particles with Stars */}
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute ${
                        i % 4 === 0
                          ? "text-3xl"
                          : "w-3 h-3 bg-yellow-300/70 rounded-full"
                      }`}
                      style={{
                        left: `${5 + i * 6}%`,
                        top: `${15 + i * 4}%`,
                      }}
                      animate={{
                        y: [0, -30, 0],
                        x: [0, Math.sin(i) * 10, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1.4, 0.5],
                        rotate: i % 4 === 0 ? [0, 360] : [0, 180, 0],
                      }}
                      transition={{
                        duration: 4 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeInOut",
                      }}
                    >
                      {i % 4 === 0 ? "✨" : ""}
                    </motion.div>
                  ))}

                  {/* Magical Sparkles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`sparkle-${i}`}
                      className="absolute text-yellow-400 text-2xl"
                      style={{
                        left: `${20 + i * 10}%`,
                        top: `${30 + i * 8}%`,
                      }}
                      animate={{
                        scale: [0, 1.5, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        repeatDelay: 3,
                      }}
                    >
                      ⭐
                    </motion.div>
                  ))}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>

      {/* Content Overlay with Enhanced Background */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 mt-16 min-h-screen flex items-center">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-yellow-400/10 to-orange-500/10 blur-3xl"
              style={{
                width: `${200 + i * 50}px`,
                height: `${200 + i * 50}px`,
                left: `${i * 20}%`,
                top: `${i * 15}%`,
              }}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8 + i,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left Column - Enhanced Content */}
          <motion.div
            className={`flex flex-col justify-center transition-all duration-1500 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-32 opacity-0"
            }`}
          >
            {/* Floating Badge */}
            <motion.div
              className="flex items-center bg-gradient-to-r from-amber-100/90 to-orange-100/90 backdrop-blur-sm rounded-full py-3 px-6 w-fit mb-8 shadow-2xl border border-white/20"
              initial={{ y: -30, opacity: 0, rotate: -5 }}
              animate={{
                y: 0,
                opacity: 1,
                rotate: 0,
                transition: {
                  delay: 0.3,
                  type: "spring",
                  bounce: 0.4,
                },
              }}
              whileHover={{
                scale: 1.05,
                rotate: 2,
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}
            >
              <Sparkles className="w-5 h-5 text-[#800020] mr-2 animate-pulse" />
              <p className="text-lg font-bold text-[#800020] mr-3">
                Culinary Excellence
              </p>
              <motion.div
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <img
                  src={assets.logoImage}
                  className="w-7 h-7 object-contain"
                  alt="Logo"
                />
              </motion.div>
            </motion.div>

            {/* Main Title with Ultra-Enhanced Animation */}
            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-tight mb-6"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  delay: 0.5,
                  duration: 1,
                  type: "spring",
                  bounce: 0.3,
                },
              }}
            >
              <motion.span
                className="block text-white drop-shadow-2xl relative"
                whileHover={{
                  textShadow: "0 0 30px rgba(255,255,255,0.9)",
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 40px rgba(255,255,255,0.8)",
                    "0 0 20px rgba(255,255,255,0.5)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Savor The
                <motion.div
                  className="absolute -top-6 -right-8 text-yellow-300 text-4xl"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                >
                  🌟
                </motion.div>
              </motion.span>
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 via-red-500 to-pink-500 relative inline-block drop-shadow-2xl"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: "300% 300%",
                }}
              >
                Flavor
                <motion.div
                  className="absolute -right-12 -top-6 text-6xl"
                  animate={{
                    rotate: [0, 25, -25, 0],
                    scale: [1, 1.4, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -left-8 -bottom-4 text-orange-400 text-4xl"
                  animate={{
                    rotate: [0, -20, 20, 0],
                    scale: [0.8, 1.3, 0.8],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.5,
                    delay: 1,
                    ease: "easeInOut",
                  }}
                >
                  🌟
                </motion.div>
                <motion.div
                  className="absolute top-1/2 left-1/2 text-yellow-200 text-2xl transform -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    scale: [0, 1.5, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: 2,
                    ease: "easeInOut",
                  }}
                >
                  ⭐
                </motion.div>
              </motion.span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p
              className="text-2xl text-white/90 leading-relaxed mb-10 font-medium drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              We bring the world's finest kitchen experiences to your home.
              Every dish is crafted with
              <motion.span
                className="relative mx-2 font-bold text-yellow-300"
                whileHover={{ scale: 1.1 }}
              >
                passion and artistry
                <motion.span
                  className="absolute -bottom-2 left-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.5, duration: 1 }}
                />
              </motion.span>
              for a truly memorable culinary journey.
            </motion.p>

            {/* Enhanced Feature Points */}
            <motion.div
              className="space-y-6 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, staggerChildren: 0.2 }}
            >
              {[
                {
                  icon: Utensils,
                  text: "Handcrafted by master chefs",
                  color: "from-amber-400 to-yellow-500",
                },
                {
                  icon: Timer,
                  text: "Premium ingredients, perfect timing",
                  color: "from-orange-400 to-red-500",
                },
                {
                  icon: Coffee,
                  text: "Elegant presentation, divine taste",
                  color: "from-red-400 to-pink-500",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center group"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.2 }}
                  whileHover={{ x: 10, transition: { duration: 0.3 } }}
                >
                  <motion.div
                    className={`w-14 h-14 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center mr-4 shadow-2xl`}
                    whileHover={{
                      scale: 1.2,
                      rotate: 15,
                      boxShadow: "0 0 30px rgba(255,255,255,0.3)",
                    }}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <p className="text-xl text-white/90 font-medium group-hover:text-white transition-colors">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <motion.button
                className="relative group bg-gradient-to-r from-[#800020] via-red-700 to-orange-600 text-white px-12 py-6 rounded-full font-bold text-xl shadow-2xl overflow-hidden border-2 border-yellow-400/30"
                whileHover={{
                  scale: 1.08,
                  boxShadow:
                    "0 25px 50px rgba(128,0,32,0.5), 0 0 50px rgba(255,215,0,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="relative z-10 flex items-center"
                  whileHover={{ x: -8 }}
                >
                  <motion.div
                    className="mr-3 text-yellow-300"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    ✨
                  </motion.div>
                  Explore Our Kitchen
                  <motion.div
                    className="ml-4"
                    animate={{ x: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.button>

              <motion.a
                href="/menu"
                className="group px-10 py-6 rounded-full border-3 border-white/90 text-white font-bold text-xl hover:bg-white hover:text-[#800020] transition-all flex items-center justify-center backdrop-blur-sm shadow-2xl overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(255,215,0,1)",
                  boxShadow:
                    "0 15px 35px rgba(255,255,255,0.3), 0 0 40px rgba(255,215,0,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="mr-3 group-hover:animate-spin"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Star className="w-6 h-6" />
                </motion.div>
                View Menu
                <motion.div
                  className="ml-2 text-yellow-300"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  ✨
                </motion.div>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column - Decorative Elements */}
          <motion.div
            className="hidden lg:flex flex-col items-center justify-center space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            {/* Floating Rating Card */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  >
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>
              <p className="text-white font-bold text-lg">Exceptional Taste</p>
              <p className="text-white/80">Rated by 10k+ customers</p>
            </motion.div>

            {/* Animated Stats */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.3,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {[
                { number: "50+", label: "Master Chefs" },
                { number: "1000+", label: "Dishes Served" },
                { number: "24/7", label: "Service" },
                { number: "100%", label: "Fresh Ingredients" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  <motion.p
                    className="text-2xl font-black text-yellow-400"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  >
                    {stat.number}
                  </motion.p>
                  <p className="text-white/80 text-sm font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Slider Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-8 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <motion.button
            onClick={() => navigateCarousel("prev")}
            className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-all group overflow-hidden"
            whileHover={{
              scale: 1.15,
              borderColor: "rgba(255,255,255,0.8)",
              boxShadow: "0 0 30px rgba(255,255,255,0.3)",
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#800020]/60 to-orange-500/60"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <ChevronLeft className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>

        <div className="pointer-events-auto">
          <motion.button
            onClick={() => navigateCarousel("next")}
            className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-all group overflow-hidden"
            whileHover={{
              scale: 1.15,
              borderColor: "rgba(255,255,255,0.8)",
              boxShadow: "0 0 30px rgba(255,255,255,0.3)",
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#800020]/60 to-orange-500/60"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <ChevronRight className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* Enhanced Slider Indicators */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center space-x-6 z-20">
        {sliderImages.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="relative group"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                index === currentSlide
                  ? "bg-white border-white scale-125"
                  : "bg-transparent border-white/70 hover:border-white"
              }`}
              layoutId={`indicator-${index}`}
            />
            {index === currentSlide && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/30"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: [0, 0.7, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
              </>
            )}
          </motion.button>
        ))}
      </div>

      {/* Image Counter with Enhanced Styling */}
      <motion.div
        className="absolute top-24 right-8 bg-black/20 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full text-white font-bold text-lg z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        whileHover={{
          scale: 1.05,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <motion.span
          key={currentSlide}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {String(currentSlide + 1).padStart(2, "0")}
        </motion.span>
        <span className="text-white/60 mx-2">/</span>
        {String(sliderImages.length).padStart(2, "0")}
      </motion.div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.4);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(
            ellipse at center,
            var(--tw-gradient-stops)
          );
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        @keyframes magical-glow {
          0%,
          100% {
            text-shadow: 0 0 5px rgba(255, 215, 0, 0.5),
              0 0 10px rgba(255, 215, 0, 0.3), 0 0 15px rgba(255, 215, 0, 0.2);
          }
          50% {
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.8),
              0 0 20px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4);
          }
        }

        .animate-magical-glow {
          animation: magical-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;
