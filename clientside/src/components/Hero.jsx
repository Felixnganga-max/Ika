import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "react-motion";
import {
  Star,
  ChevronRight,
  ChevronLeft,
  PlusCircle,
  ThumbsUp,
} from "lucide-react";
import assets from "../assets/assets.js";

const Hero = () => {
  const [activeCategory, setActiveCategory] = useState("Breakfast");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const menuRef = useRef(null);

  // Stars background configuration
  const stars = Array(50)
    .fill()
    .map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDuration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));

  const menuCategories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Children Dishes",
    "Desserts",
    "Beverages",
  ];

  const menuItems = {
    Breakfast: [
      {
        name: "Pancake Stack",
        price: 850,
        image: assets.pancakes,
        description: "Fluffy pancakes with maple syrup and fresh berries",
        rating: 4.8,
        isNew: true,
      },
      {
        name: "Avocado Toast",
        price: 650,
        image: assets.avocado,
        description:
          "Sourdough with smashed avocado, poached egg and chili flakes",
        rating: 4.6,
        isPopular: true,
      },
      {
        name: "Full English",
        price: 1200,
        image: assets.tea,
        description: "Traditional English breakfast with bacon, eggs and beans",
        rating: 4.9,
      },
    ],
    Lunch: [
      {
        name: "Chicken Salad",
        price: 950,
        image: assets.avocado,
        description: "Grilled chicken with fresh greens and house dressing",
        rating: 4.5,
        isHealthy: true,
      },
      {
        name: "Beef Burger",
        price: 1100,
        image: assets.avocado,
        description: "Juicy beef patty with cheese, lettuce and special sauce",
        rating: 4.7,
        isPopular: true,
      },
      {
        name: "Vegetable Pasta",
        price: 850,
        image: assets.tea,
        description: "Penne with seasonal vegetables and pesto sauce",
        rating: 4.4,
        isVegetarian: true,
      },
    ],
    Dinner: [
      {
        name: "Grilled Salmon",
        price: 1800,
        image: assets.tea,
        description: "Atlantic salmon with lemon butter and roasted vegetables",
        rating: 4.9,
        isPopular: true,
      },
      {
        name: "Ribeye Steak",
        price: 2200,
        image: assets.tea,
        description: "300g prime cut with fries and mushroom sauce",
        rating: 4.8,
        isNew: true,
      },
      {
        name: "Mushroom Risotto",
        price: 1300,
        image: assets.tea,
        description: "Creamy arborio rice with wild mushrooms and parmesan",
        rating: 4.6,
        isVegetarian: true,
      },
    ],
    "Children Dishes": [
      {
        name: "Mini Pizza",
        price: 600,
        image: assets.tea,
        description: "Personal sized margherita pizza with fun toppings",
        rating: 4.7,
        isPopular: true,
      },
      {
        name: "Chicken Nuggets",
        price: 550,
        image: assets.tea,
        description: "Crispy chicken bites with honey mustard dip",
        rating: 4.6,
      },
      {
        name: "Mac & Cheese",
        price: 500,
        image: assets.avocado,
        description: "Classic creamy macaroni with golden crust",
        rating: 4.8,
        isNew: true,
      },
    ],
    Desserts: [
      {
        name: "Chocolate Cake",
        price: 750,
        image: assets.tea,
        description: "Rich chocolate layers with ganache frosting",
        rating: 4.9,
        isPopular: true,
      },
      {
        name: "Cheesecake",
        price: 800,
        image: assets.tea,
        description: "New York style with fresh berry compote",
        rating: 4.8,
      },
      {
        name: "Ice Cream Sundae",
        price: 650,
        image: assets.tea,
        description: "Vanilla ice cream with hot fudge and toppings",
        rating: 4.7,
        isNew: true,
      },
    ],
    Beverages: [
      {
        name: "Fresh Juice",
        price: 350,
        image: assets.tea,
        description: "Seasonal fruit juice, freshly squeezed",
        rating: 4.6,
        isHealthy: true,
      },
      {
        name: "Iced Coffee",
        price: 450,
        image: assets.tea,
        description: "Cold brew with milk and caramel drizzle",
        rating: 4.7,
        isPopular: true,
      },
      {
        name: "Smoothie",
        price: 500,
        image: assets.tea,
        description: "Mixed berry protein smoothie with honey",
        rating: 4.8,
        isHealthy: true,
      },
    ],
  };

  const featuredItems = [
    {
      name: "Chef's Special",
      image: assets.tea,
      rating: 4.9,
      description: "Limited time offer! Our chef's award-winning creation",
      price: 1850,
    },
    {
      name: "Seasonal Dish",
      image: assets.avocado,
      rating: 4.7,
      description: "Made with fresh, locally-sourced ingredients",
      price: 1650,
    },
    {
      name: "Customer Favorite",
      image: assets.pancakes,
      rating: 4.8,
      description: "Our most ordered dish, loved by everyone",
      price: 1750,
    },
  ];

  // Auto-rotate featured items
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredItems.length]);

  // Page load animation
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  // Scroll menu into view when category changes
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.scrollTop = 0;
    }
  }, [activeCategory]);

  // Handle menu scroll
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const navigateCarousel = (direction) => {
    if (direction === "next") {
      setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
    } else {
      setCurrentSlide(
        (prev) => (prev - 1 + featuredItems.length) % featuredItems.length
      );
    }
  };

  return (
    <div className="relative w-full mt-20 overflow-hidden bg-gradient-to-b from-orange-50 to-white min-h-screen">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-yellow-200"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              opacity: 0.6,
              boxShadow: `0 0 ${star.size * 2}px ${
                star.size / 2
              }px rgba(255, 224, 138, 0.8)`,
              animation: `twinkle ${star.animationDuration}s ease-in-out ${star.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Floating Food Icons Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url(${
            assets.foodPatternBg || "https://cdn.example.com/food-pattern.png"
          })`,
          backgroundSize: "200px",
          animation: "floatBackground 60s linear infinite",
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - with entrance animation */}
        <div
          className={`flex flex-col justify-center space-y-6 transition-all duration-1000 ${
            isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
          }`}
        >
          {/* Animated Delivery Tag */}
          <div className="flex items-center bg-orange-100 rounded-full py-2 px-4 w-fit animate-bounce-slow">
            <p className="text-lg font-semibold text-[#800020] mr-2">
              Fast, affordable and safe delivery
            </p>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md">
              <img
                src={assets.logoImage}
                className="w-6 h-6 object-contain animate-spin-slow"
                alt="Logo"
              />
            </div>
          </div>

          {/* Main Heading with Text Animation */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            <span className="inline-block animate-text-slide-up-1">
              Delivery or takeaway food
            </span>{" "}
            <br />
            <span className="text-[#800020] inline-block animate-text-slide-up-2">
              Fresh and Fast
              <span className="absolute -right-6 top-0 text-yellow-500 animate-pulse">
                ✨
              </span>
            </span>
          </h1>

          {/* Description with Animated Highlight */}
          <p className="text-lg text-gray-600 relative">
            Enjoy restaurant-quality meals prepared with fresh ingredients and
            delivered to your doorstep. Our chefs craft each dish with
            <span className="relative mx-1 font-semibold">
              love and passion
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300 animate-width-expand"></span>
            </span>
            , ensuring you get the best dining experience at home.
          </p>

          {/* Animated CTA Button */}
          <button className="relative bg-gradient-to-r from-[#800020] to-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold w-fit shadow-lg hover:shadow-xl transition-all overflow-hidden group">
            <span className="relative z-10">Order Now</span>
            <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-[#800020] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-x-8 transition-all duration-300">
              <ChevronRight className="w-5 h-5" />
            </span>
          </button>

          {/* Featured Items Carousel with Controls */}
          <div className="relative mt-8 h-48 overflow-hidden rounded-xl shadow-lg">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300 z-10"></div>

            {featuredItems.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center p-6 bg-white rounded-xl ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0 transition-all duration-500"
                    : "opacity-0 translate-x-full transition-all duration-500"
                }`}
              >
                <div className="relative w-28 h-28">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  />
                  {/* Hot badge */}
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
                    HOT!
                  </div>
                </div>

                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    {item.name}
                    <span className="ml-2 inline-block animate-bounce-slow">
                      🔥
                    </span>
                  </h3>

                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(item.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">{item.rating}</span>
                  </div>

                  <p className="mt-1 text-gray-500 text-sm">
                    {item.description}
                  </p>

                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold text-[#800020]">
                      KSh. {item.price}
                    </span>
                    <button className="bg-orange-100 hover:bg-orange-200 text-orange-600 px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center">
                      Add to cart
                      <PlusCircle className="ml-1 w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Controls */}
            <div className="absolute bottom-3 right-3 flex space-x-2">
              <button
                onClick={() => navigateCarousel("prev")}
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateCarousel("next")}
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-orange-500 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Menu with entrance animation */}
        <div
          className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-1000 ${
            isLoaded ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
        >
          {/* Appetizing Header */}
          <div className="relative h-24 bg-gradient-to-r from-orange-400 to-red-600 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-2xl font-bold text-white z-10 flex items-center">
                <span className="mr-2">Our Delicious Menu</span>
                <span className="inline-block animate-bounce-slow">🍽️</span>
              </h2>
            </div>

            {/* Food Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-20 bg-repeat"
              style={{
                backgroundImage: `url(${
                  assets.foodPatternBg ||
                  "https://cdn.example.com/food-pattern.png"
                })`,
                backgroundSize: "100px",
                animation: "floatBackground 30s linear infinite",
              }}
            ></div>
          </div>

          {/* Menu Categories with Animation */}
          <div className="sticky top-0 z-10 flex overflow-x-auto bg-gray-50 p-2 shadow-md">
            {menuCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 mx-1 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-[#800020] to-orange-600 text-white scale-105 shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
                {activeCategory === category && (
                  <span className="ml-1 inline-block">
                    {category === "Breakfast"
                      ? "🍳"
                      : category === "Lunch"
                      ? "🥗"
                      : category === "Dinner"
                      ? "🍽️"
                      : category === "Children Dishes"
                      ? "🧸"
                      : category === "Desserts"
                      ? "🍰"
                      : "🥤"}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Menu Items with Hover Effects */}
          <div
            ref={menuRef}
            className="p-4 grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto"
          >
            {menuItems[activeCategory].map((item, index) => (
              <div
                key={index}
                className={`relative flex items-start p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                  hoveredItem === index
                    ? "bg-orange-50 shadow-md -translate-y-1"
                    : "hover:bg-orange-50 hover:shadow-sm"
                }`}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Special Tags */}
                {item.isNew && (
                  <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 animate-pulse">
                    NEW!
                  </div>
                )}
                {item.isPopular && !item.isNew && (
                  <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs font-bold rounded-full px-2 py-1">
                    POPULAR
                  </div>
                )}
                {item.isHealthy && !item.isNew && !item.isPopular && (
                  <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs font-bold rounded-full px-2 py-1">
                    HEALTHY
                  </div>
                )}
                {item.isVegetarian &&
                  !item.isNew &&
                  !item.isPopular &&
                  !item.isHealthy && (
                    <div className="absolute -top-2 -left-2 bg-green-600 text-white text-xs font-bold rounded-full px-2 py-1">
                      VEG
                    </div>
                  )}

                {/* Food Image with Animation */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`w-24 h-24 object-cover rounded-lg shadow-md transition-all duration-300 ${
                      hoveredItem === index ? "scale-110" : ""
                    }`}
                  />

                  {/* Steam Animation for Hot Foods (breakfast, lunch, dinner) */}
                  {(activeCategory === "Breakfast" ||
                    activeCategory === "Lunch" ||
                    activeCategory === "Dinner") && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="steam-container">
                        <div className="steam steam-one"></div>
                        <div className="steam steam-two"></div>
                        <div className="steam steam-three"></div>
                        <div className="steam steam-four"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.description}
                  </p>

                  <div className="mt-3 flex justify-between items-center">
                    <span className="font-bold text-lg text-[#800020]">
                      KSh. {item.price}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                      </button>

                      <button
                        className={`flex items-center justify-center px-3 py-1 rounded-full transition-colors ${
                          hoveredItem === index
                            ? "bg-gradient-to-r from-[#800020] to-orange-600 text-white"
                            : "bg-orange-100 hover:bg-orange-200 text-orange-600"
                        }`}
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.8;
          }
        }

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

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        .animate-text-slide-up-1 {
          animation: slideUp 0.6s ease-out;
        }

        .animate-text-slide-up-2 {
          animation: slideUp 0.8s ease-out;
        }

        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .steam-container {
          position: relative;
          width: 20px;
        }

        .steam {
          position: absolute;
          height: 10px;
          width: 4px;
          border-radius: 10px;
          background-color: #fff;
          margin-left: 8px;
          z-index: 1;
          opacity: 0;
        }

        .steam-one {
          animation: steamOne 4s ease-out infinite;
        }

        .steam-two {
          animation: steamTwo 4s ease-out 0.5s infinite;
        }

        .steam-three {
          animation: steamThree 4s ease-out 1s infinite;
        }

        .steam-four {
          animation: steamFour 4s ease-out 1.5s infinite;
        }

        @keyframes steamOne {
          0% {
            transform: translateY(0) translateX(0) scale(0.25);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-15px) translateX(-5px) scale(1);
            opacity: 0;
          }
        }

        @keyframes steamTwo {
          0% {
            transform: translateY(0) translateX(0) scale(0.25);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-20px) translateX(5px) scale(1);
            opacity: 0;
          }
        }

        @keyframes steamThree {
          0% {
            transform: translateY(0) translateX(0) scale(0.25);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-15px) translateX(-7px) scale(1);
            opacity: 0;
          }
        }

        @keyframes steamFour {
          0% {
            transform: translateY(0) translateX(0) scale(0.25);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-20px) translateX(7px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
