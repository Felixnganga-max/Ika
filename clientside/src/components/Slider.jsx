import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Clock,
  ChefHat,
  Utensils,
  X,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
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
  const [categories, setCategories] = useState(["all"]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get user from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Check screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch foods from API and extract unique categories
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(
          "https://ika-cua5-backend.vercel.app/api/food/"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setFoods(response.data.data);

          // Extract unique categories
          const uniqueCategories = ["all"];
          response.data.data.forEach((food) => {
            if (
              food.category &&
              !uniqueCategories.includes(food.category.toLowerCase())
            ) {
              uniqueCategories.push(food.category.toLowerCase());
            }
          });
          setCategories(uniqueCategories);
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

  // Add item to cart via API (for logged-in users)
  const addToCartAPI = async (itemId, userId) => {
    try {
      const response = await axios.post("http://localhost:4000/api/cart/add", {
        itemId: itemId,
        userId: userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart via API:", error);
      // If API fails, we'll still add to localStorage
      return null;
    }
  };

  // Handle adding to cart with animation and persistence
  const handlePlaceOrder = async (food) => {
    if ("vibrate" in navigator) navigator.vibrate(50);

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item) => item._id === food._id);

    if (existingItemIndex > -1) {
      // If item exists, increase quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: (updatedCart[existingItemIndex].quantity || 1) + 1,
      };
      setCart(updatedCart);
    } else {
      // If new item, add to cart with quantity 1
      const newItem = { ...food, quantity: 1 };
      setCart((prev) => [...prev, newItem]);
    }

    // If user is logged in, also add to database
    if (user && user.id) {
      await addToCartAPI(food._id, user.id);
    }

    // Show animation
    setAddedItem(food);
    setShowAddAnimation(true);
    setTimeout(() => {
      setShowAddAnimation(false);
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
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  // Update item quantity in cart
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(index);
      return;
    }

    const updatedCart = [...cart];
    updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
    setCart(updatedCart);
  };

  // Get total cart quantity
  const getTotalCartQuantity = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Get cart total price
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.isOnOffer ? item.offerPrice : item.price;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Filter foods by category
  const filteredFoods =
    activeCategory === "all"
      ? foods
      : foods.filter((food) => food.category.toLowerCase() === activeCategory);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="p-8 rounded-xl bg-gray-900 shadow-lg border border-gray-800">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <ChefHat size={32} className="text-orange-500" />
            </motion.div>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-700 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-orange-500 font-medium">
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
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="p-8 rounded-xl bg-red-900 border border-red-800">
          <p className="text-red-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-800 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-12 bg-gray-100 dark:bg-gray-900 min-h-screen relative overflow-hidden">
      {/* Header */}
      <div className="w-full flex justify-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 px-8 py-4 rounded-lg shadow-md mb-8 border-b border-gray-200 dark:border-gray-700"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center text-red-900 dark:text-white flex items-center justify-center gap-2">
            <span className="text-orange-500">✨</span>
            Delicious Food Haven
            <span className="text-orange-500">✨</span>
          </h1>
          {user && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, {user.name}!
            </p>
          )}
        </motion.div>
      </div>

      {/* Floating Cart Button - Centered at top */}
      <motion.button
        className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-900 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center hover:bg-red-800 transition-colors duration-200"
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
              className="absolute -top-2 -right-2 bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            >
              {getTotalCartQuantity()}
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
            className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-red-900 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-3"
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
          <div className="flex gap-2 md:gap-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-red-900 text-white shadow-md"
                    : "bg-transparent text-red-900 dark:text-white hover:bg-red-100 dark:hover:bg-gray-700"
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
              <div className="h-full rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

                  {/* Favorite Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(food._id);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart
                      size={16}
                      className={
                        favorites.includes(food._id)
                          ? "fill-red-600 text-red-600"
                          : "text-gray-400"
                      }
                    />
                  </motion.button>

                  {/* Special Offer Badge */}
                  {food.isOnOffer && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white font-bold py-1 px-3 rounded-lg text-xs shadow-md">
                      {Math.round((1 - food.offerPrice / food.price) * 100)}%
                      OFF
                    </div>
                  )}

                  {/* Category Tag */}
                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 rounded-lg px-3 py-1 text-xs font-semibold text-red-900 dark:text-white shadow-md">
                    {food.category}
                  </div>
                </div>

                {/* Food Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {food.name}
                    </h3>
                    <div className="flex flex-col items-end">
                      {food.isOnOffer ? (
                        <>
                          <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                            KSh. {food.price}
                          </span>
                          <span className="text-red-900 dark:text-orange-500 font-bold">
                            KSh. {food.offerPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-red-900 dark:text-orange-500 font-bold">
                          KSh. {food.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {food.description}
                  </p>

                  {/* Order Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaceOrder(food);
                    }}
                    className="w-full bg-red-900 text-white py-3 px-4 rounded-lg shadow-md font-medium hover:bg-red-800 transition-colors"
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
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeProductModal}
            />

            <motion.div
              className="fixed inset-0 m-auto w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden z-[9999] flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close Button */}
              <button
                onClick={closeProductModal}
                className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <X size={24} className="text-gray-700 dark:text-gray-200" />
              </button>

              {/* Image Gallery */}
              <div className="relative h-1/2 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                {selectedProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ChevronLeft
                        size={24}
                        className="text-gray-700 dark:text-gray-200"
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <ChevronRight
                        size={24}
                        className="text-gray-700 dark:text-gray-200"
                      />
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
                            ? "bg-red-900 w-4"
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedProduct.name}
                    </h2>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {selectedProduct.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {selectedProduct.isOnOffer ? (
                      <>
                        <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                          KSh. {selectedProduct.price}
                        </span>
                        <span className="text-red-900 dark:text-orange-500 font-bold text-xl block">
                          KSh. {selectedProduct.offerPrice}
                        </span>
                        <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-lg font-bold">
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
                      <span className="text-red-900 dark:text-orange-500 font-bold text-xl">
                        KSh. {selectedProduct.price}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {selectedProduct.description}
                </p>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Preparation
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Clock
                        size={14}
                        className="mr-1 text-red-900 dark:text-orange-500"
                      />
                      15-25 mins
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Servings
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Utensils
                        size={14}
                        className="mr-1 text-red-900 dark:text-orange-500"
                      />
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
                  className="w-full bg-red-900 text-white py-4 px-6 rounded-lg shadow-md font-bold text-lg mt-4 hover:bg-red-800 transition-colors"
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              className={`fixed ${
                isMobile
                  ? "bottom-0 left-0 w-full max-h-[80vh] rounded-t-lg"
                  : "top-0 right-0 w-96 h-full"
              } bg-white dark:bg-gray-800 shadow-2xl p-6 overflow-y-auto z-[9999]`}
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
                <h2 className="text-2xl font-bold text-red-900 dark:text-white">
                  Your Order
                </h2>
                <div className="flex gap-2">
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {cart.length > 0 ? (
                <>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {cart.map((food, index) => (
                      <motion.div
                        key={`${food._id}-${index}`}
                        className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={food.images[0]}
                          alt={food.name}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                            {food.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">
                            {food.category}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-red-900 dark:text-orange-500 font-bold text-sm">
                              KSh.{" "}
                              {food.isOnOffer ? food.offerPrice : food.price}
                            </span>
                            {food.isOnOffer && (
                              <span className="text-gray-500 dark:text-gray-400 line-through text-xs">
                                KSh. {food.price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(index, (food.quantity || 1) - 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-red-100 dark:hover:bg-red-800 text-gray-700 dark:text-gray-300 hover:text-red-900 dark:hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus size={16} />
                          </motion.button>

                          <span className="w-8 text-center font-semibold text-gray-800 dark:text-white">
                            {food.quantity || 1}
                          </span>

                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(index, (food.quantity || 1) + 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-green-100 dark:hover:bg-green-800 text-gray-700 dark:text-gray-300 hover:text-green-900 dark:hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus size={16} />
                          </motion.button>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromCart(index);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X size={16} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Items ({getTotalCartQuantity()})
                        </span>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          KSh. {getCartTotal().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Delivery Fee
                        </span>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          KSh. 50.00
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="font-semibold text-gray-800 dark:text-white">
                          Total
                        </span>
                        <span className="font-bold text-xl text-red-900 dark:text-orange-500">
                          KSh. {(getCartTotal() + 50).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <motion.button
                      onClick={() => {
                        // Handle checkout logic here
                        alert(
                          `Proceeding to checkout with ${getTotalCartQuantity()} items worth KSh. ${(
                            getCartTotal() + 50
                          ).toFixed(2)}`
                        );
                      }}
                      className="w-full bg-red-900 text-white py-4 px-6 rounded-lg shadow-md font-bold text-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart size={20} />
                      Proceed to Checkout
                    </motion.button>

                    {/* Continue Shopping Button */}
                    <motion.button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full mt-3 bg-transparent border-2 border-red-900 text-red-900 dark:text-orange-500 dark:border-orange-500 py-3 px-6 rounded-lg font-medium hover:bg-red-900 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue Shopping
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🛒
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Add some delicious items to get started!
                  </p>
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-red-900 text-white rounded-lg font-medium hover:bg-red-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue Shopping
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
