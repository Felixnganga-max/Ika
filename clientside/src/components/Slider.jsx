import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Clock,
  Star,
  ChefHat,
  Utensils,
  Coffee,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FoodSlider = () => {
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Check screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch foods from API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/food/");
        if (response.data && Array.isArray(response.data.data)) {
          setFoods(response.data.data);
        } else {
          setError("Unexpected API response format.");
        }
      } catch (err) {
        setError("Failed to load food data.");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Handle adding to cart with animation
  const handlePlaceOrder = (food) => {
    if ("vibrate" in navigator) navigator.vibrate(50);
    setAddedItem(food);
    setShowAddAnimation(true);
    setTimeout(() => {
      setShowAddAnimation(false);
      setCart((prev) => [...prev, food]);
    }, 1000);
  };

  // Toggle favorite status
  const toggleFavorite = (foodId) => {
    setFavorites((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId]
    );
  };

  // Open product details modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  // Close product details modal
  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  // Navigate through product images
  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1
    );
  };

  // Remove item from cart
  const handleRemoveFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Categories from your database
  const categories = [
    "all",
    "pizza",
    "pasta",
    "salad",
    "burger",
    "dessert",
    "beverage",
  ];

  // Filter foods by category
  const filteredFoods =
    activeCategory === "all"
      ? foods
      : foods.filter((food) => food.category.toLowerCase() === activeCategory);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF0E6] to-[#FFF5F5]">
        <div className="p-8 rounded-xl bg-white/30 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <ChefHat size={32} className="text-[#FF6B6B]" />
            </motion.div>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-[#FF6B6B]/30 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-[#FF6B6B]/30 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-[#FF6B6B]/30 rounded"></div>
                  <div className="h-4 bg-[#FF6B6B]/30 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[#FF6B6B] font-medium">
              Preparing your delicious treats...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF0E6] to-[#FFF5F5]">
        <div className="p-8 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-12 bg-gradient-to-b from-[#FFF0E6] to-[#FFF5F5] min-h-screen relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF6B6B] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FFD166] opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-[#FF6B6B] opacity-15 rounded-full blur-2xl"></div>

        {/* Animated food icons */}
        <motion.div
          className="absolute top-10 right-10 text-6xl opacity-10"
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🍕
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-10 text-6xl opacity-10"
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🍔
        </motion.div>
        <motion.div
          className="absolute top-60 left-40 text-5xl opacity-10"
          animate={{ y: [0, -5, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🍝
        </motion.div>
      </div>

      {/* Header */}
      <div className="w-full flex justify-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white px-8 py-4 rounded-full shadow-md mb-8 backdrop-blur-sm bg-opacity-90 border border-pink-100"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-[#FF6B6B] flex items-center gap-2">
            <span className="text-yellow-500">✨</span>
            Delicious Food Haven
            <span className="text-yellow-500">✨</span>
          </h1>
        </motion.div>
      </div>

      {/* Floating Cart Button */}
      <motion.button
        className="fixed top-6 right-6 bg-[#FF6B6B] text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center hover:bg-[#FF5252] transition-colors duration-200"
        whileHover={{ scale: 1.05, rotate: [0, -10, 10, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        <ShoppingCart size={24} />
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute -top-2 -right-2 bg-[#FFD166] text-[#FF6B6B] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            >
              {cart.length}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Add to Cart Animation */}
      <AnimatePresence>
        {showAddAnimation && addedItem && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#FF6B6B] text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-3"
          >
            <img
              src={addedItem.images[0]}
              alt={addedItem.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
            <span>Added to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Category Selector */}
        <motion.div
          className="flex justify-center mb-8 overflow-x-auto py-2 max-w-full no-scrollbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-2 md:gap-4 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[#FF6B6B] text-white shadow-md"
                    : "bg-transparent text-[#FF6B6B] hover:bg-pink-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredFoods.map((food, index) => (
            <motion.div
              key={food._id}
              className="relative group h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Food Card */}
              <div className="h-full rounded-3xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-pink-100">
                {/* Food Image */}
                <div
                  className="relative h-52 overflow-hidden cursor-pointer"
                  onClick={() => openProductModal(food)}
                >
                  <motion.img
                    src={food.images[0]}
                    alt={food.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

                  {/* Rating */}
                  <div className="absolute top-4 left-4 flex items-center bg-white rounded-full px-2 py-1 shadow-md">
                    <Star
                      size={14}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="ml-1 text-xs font-bold text-gray-700">
                      {food.rating || "4." + Math.floor(Math.random() * 9 + 1)}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(food._id);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      size={16}
                      className={
                        favorites.includes(food._id)
                          ? "fill-[#FF6B6B] text-[#FF6B6B]"
                          : "text-gray-400"
                      }
                    />
                  </motion.button>

                  {/* Special Offer Badge */}
                  {food.isOnOffer && (
                    <div className="absolute top-4 right-16 bg-[#FFD166] text-[#FF6B6B] font-bold py-1 px-2 rounded-full text-xs shadow-md">
                      {Math.round((1 - food.offerPrice / food.price) * 100)}%
                      OFF
                    </div>
                  )}

                  {/* Category Tag */}
                  <div className="absolute bottom-4 left-4 bg-white/90 rounded-full px-3 py-1 text-xs font-semibold text-[#FF6B6B] shadow-md">
                    {food.category}
                  </div>
                </div>

                {/* Food Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {food.name}
                    </h3>
                    <div className="flex flex-col items-end">
                      {food.isOnOffer ? (
                        <>
                          <span className="text-gray-500 line-through text-sm">
                            KSh. {food.price}
                          </span>
                          <span className="text-[#FF6B6B] font-bold">
                            KSh. {food.offerPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#FF6B6B] font-bold">
                          KSh. {food.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {food.description}
                  </p>

                  {/* Order Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaceOrder(food);
                    }}
                    className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white py-3 px-4 rounded-full shadow-md font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFoods.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              Try selecting a different category or check back later for new
              menu items.
            </p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProductModal}
            />

            <motion.div
              className="fixed inset-0 m-auto w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden z-[9999] flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close Button */}
              <button
                onClick={closeProductModal}
                className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-700" />
              </button>

              {/* Image Gallery */}
              <div className="relative h-1/2 w-full overflow-hidden bg-gray-100">
                {selectedProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight size={24} className="text-gray-700" />
                    </button>
                  </>
                )}

                <img
                  src={selectedProduct.images[currentImageIndex]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />

                {/* Image Indicators */}
                {selectedProduct.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {selectedProduct.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-[#FF6B6B] w-4"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedProduct.name}
                    </h2>
                    <div className="flex items-center mt-1">
                      <Star
                        size={16}
                        className="text-yellow-500 fill-yellow-500 mr-1"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {selectedProduct.rating || "4.5"} •{" "}
                        {selectedProduct.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {selectedProduct.isOnOffer ? (
                      <>
                        <span className="text-gray-500 line-through text-sm">
                          KSh. {selectedProduct.price}
                        </span>
                        <span className="text-[#FF6B6B] font-bold text-xl block">
                          KSh. {selectedProduct.offerPrice}
                        </span>
                        <span className="text-xs bg-[#FFD166] text-[#FF6B6B] px-2 py-0.5 rounded-full font-bold">
                          {Math.round(
                            (1 -
                              selectedProduct.offerPrice /
                                selectedProduct.price) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-[#FF6B6B] font-bold text-xl">
                        KSh. {selectedProduct.price}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  {selectedProduct.description}
                </p>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">
                      Preparation
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      <Clock size={14} className="mr-1 text-[#FF6B6B]" />
                      15-25 mins
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Servings</div>
                    <div className="flex items-center text-sm font-medium">
                      <Utensils size={14} className="mr-1 text-[#FF6B6B]" />
                      1-2 people
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  onClick={() => {
                    handlePlaceOrder(selectedProduct);
                    closeProductModal();
                  }}
                  className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white py-4 px-6 rounded-xl shadow-md font-bold text-lg mt-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add to Cart - KSh.{" "}
                  {selectedProduct.isOnOffer
                    ? selectedProduct.offerPrice
                    : selectedProduct.price}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              className={`fixed ${
                isMobile
                  ? "bottom-0 left-0 w-full max-h-[80vh] rounded-t-3xl"
                  : "top-0 right-0 w-96 h-full rounded-l-3xl"
              } bg-white shadow-2xl p-6 overflow-y-auto z-[9999]`}
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
                <h2 className="text-2xl font-bold text-[#FF6B6B]">
                  Your Order
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 hover:bg-pink-200 text-[#FF6B6B] transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {cart.length > 0 ? (
                <>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {cart.map((food, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4 bg-pink-50 p-4 rounded-2xl hover:bg-pink-100 transition-colors duration-200 group relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={food.images[0]}
                          alt={food.name}
                          className="w-20 h-20 object-cover rounded-xl shadow-md"
                        />
                        <div className="flex-1">
                          <p className="text-base font-semibold text-gray-800">
                            {food.name}
                          </p>
                          <p className="text-[#FF6B6B] text-lg font-bold">
                            KSh. {food.isOnOffer ? food.offerPrice : food.price}
                          </p>
                        </div>
                        <motion.button
                          onClick={() => handleRemoveFromCart(index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X size={12} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="mt-6 border-t border-pink-100 pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* Order Summary */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal ({cart.length} items)</span>
                        <span className="font-medium text-gray-800">
                          KSh.{" "}
                          {cart.reduce(
                            (total, food) =>
                              total +
                              (food.isOnOffer ? food.offerPrice : food.price),
                            0
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Delivery Fee</span>
                        <span className="font-medium text-gray-800">
                          KSh. 150
                        </span>
                      </div>

                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Service Fee</span>
                        <span className="font-medium text-gray-800">
                          KSh. 50
                        </span>
                      </div>

                      <div className="h-px bg-pink-100 my-3"></div>

                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-gray-800">Total</span>
                        <span className="text-[#FF6B6B]">
                          KSh.{" "}
                          {cart.reduce(
                            (total, food) =>
                              total +
                              (food.isOnOffer ? food.offerPrice : food.price),
                            0
                          ) + 200}
                        </span>
                      </div>
                    </div>

                    {/* Estimated Delivery Time */}
                    <div className="mt-4 p-4 bg-yellow-50 rounded-2xl flex items-center gap-3 border border-yellow-100">
                      <Clock size={20} className="text-yellow-500" />
                      <div>
                        <p className="font-medium text-gray-800">
                          Estimated Delivery
                        </p>
                        <p className="text-gray-600 text-sm">25-40 minutes</p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <motion.button
                      className="w-full mt-6 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] rounded-xl text-white font-bold uppercase shadow-lg relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const token = localStorage.getItem("token");
                        if (token) {
                          const totalAmount =
                            cart.reduce(
                              (total, food) =>
                                total +
                                (food.isOnOffer ? food.offerPrice : food.price),
                              0
                            ) + 200;
                          navigate("/checkout", {
                            state: {
                              cart: cart,
                              total: totalAmount,
                            },
                          });
                        } else {
                          navigate("/login");
                        }
                      }}
                    >
                      Complete Order
                    </motion.button>

                    {/* Security Notice */}
                    <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
                      <span>🔒</span>
                      Secure payment processing
                    </p>
                  </motion.div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      rotate: [0, 10, -10, 10, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      times: [0, 0.2, 0.4, 0.6, 0.8],
                    }}
                    className="text-6xl mb-6"
                  >
                    🛒
                  </motion.div>
                  <p className="text-center text-lg font-medium text-gray-800">
                    Your cart is empty
                  </p>
                  <p className="text-center text-gray-500 text-sm mt-2 max-w-xs">
                    Add some delicious food to get started
                  </p>
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-6 px-8 py-3 bg-[#FF6B6B] text-white rounded-full hover:bg-[#FF5252] transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Menu
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodSlider;
