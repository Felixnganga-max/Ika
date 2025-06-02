import React, { useState, useEffect, useRef } from "react";
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
  User,
} from "lucide-react";
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
  const [cartLoading, setCartLoading] = useState(false);
  const [token, setToken] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Base API URL
  const API_BASE_URL = "https://ika-cua5-backend.vercel.app/api";

  // Get authentication token and user from localStorage on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log("Token from localStorage:", authToken);
    console.log("User data from localStorage:", userData);

    if (authToken) {
      setToken(authToken);
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Check if user is authenticated
  const isUserAuthenticated = () => {
    return token && user && (user.id || user._id);
  };

  // Get user ID from user object
  const getUserId = () => {
    if (!user) return null;
    return user.id || user._id || null;
  };

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
        console.log("Fetching foods from API...");
        const response = await fetch(`${API_BASE_URL}/food/`);
        const data = await response.json();

        console.log("Foods API response:", data);

        if (data && Array.isArray(data.data)) {
          setFoods(data.data);

          // Extract unique categories
          const uniqueCategories = ["all"];
          data.data.forEach((food) => {
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
        console.error("Error fetching foods:", err);
        setError("Failed to load food data.");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Load cart from localStorage and API on component mount
  useEffect(() => {
    const loadCart = async () => {
      if (isUserAuthenticated()) {
        console.log("Loading cart from API for authenticated user");
        await fetchCartFromAPI();
      } else {
        console.log("Loading cart from localStorage for guest user");
        const savedCart = localStorage.getItem("guestCart");
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            setCart(parsedCart);
          } catch (error) {
            console.error("Error parsing guest cart data:", error);
          }
        }
      }
    };

    if (foods.length > 0) {
      loadCart();
    }
  }, [user, token, foods]);

  // Save guest cart to localStorage whenever cart changes
  useEffect(() => {
    if (!isUserAuthenticated() && cart.length >= 0) {
      localStorage.setItem("guestCart", JSON.stringify(cart));
    }
  }, [cart, user, token]);

  // Fetch cart items from API
  const fetchCartFromAPI = async () => {
    if (!isUserAuthenticated()) {
      console.log("User not authenticated, skipping cart fetch");
      return;
    }

    setCartLoading(true);
    try {
      console.log("Fetching cart with token:", token);
      const response = await fetch(`${API_BASE_URL}/cart/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Cart API response:", data);

      if (data.success && data.cartData) {
        const cartData = data.cartData;
        const cartItems = [];

        for (const [itemId, quantity] of Object.entries(cartData)) {
          const foodItem = foods.find((food) => food._id === itemId);
          if (foodItem) {
            cartItems.push({ ...foodItem, quantity });
          }
        }

        console.log("Processed cart items:", cartItems);
        setCart(cartItems);
      } else {
        console.log("No cart data found or API error:", data);
      }
    } catch (error) {
      console.error("Error fetching cart from API:", error);
    } finally {
      setCartLoading(false);
    }
  };

  // Add item to cart via API
  const addToCartAPI = async (itemId) => {
    if (!isUserAuthenticated()) {
      console.log("User not authenticated, cannot add to cart via API");
      return null;
    }

    try {
      console.log("Adding item to cart via API:", itemId, "with token:", token);
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await response.json();
      console.log("Add to cart API response:", data);
      return data;
    } catch (error) {
      console.error("Error adding to cart via API:", error);
      return null;
    }
  };

  // Remove item from cart via API
  const removeFromCartAPI = async (itemId) => {
    if (!isUserAuthenticated()) {
      console.log("User not authenticated, cannot remove from cart via API");
      return null;
    }

    try {
      console.log("Removing item from cart via API:", itemId);
      const response = await fetch(`${API_BASE_URL}/cart/remove/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Remove from cart API response:", data);
      return data;
    } catch (error) {
      console.error("Error removing from cart via API:", error);
      return null;
    }
  };

  // Handle adding to cart with animation and persistence
  const handlePlaceOrder = async (food) => {
    if ("vibrate" in navigator) navigator.vibrate(50);

    console.log(
      "Adding to cart:",
      food.name,
      "- User authenticated:",
      isUserAuthenticated()
    );

    if (isUserAuthenticated()) {
      console.log("Using API to add to cart");
      const result = await addToCartAPI(food._id);
      if (result && result.success) {
        console.log("Successfully added to cart via API");
        await fetchCartFromAPI();
      } else {
        console.log("API failed, falling back to local cart");
        updateLocalCart(food);
      }
    } else {
      console.log("Using local cart");
      updateLocalCart(food);
    }

    setAddedItem(food);
    setShowAddAnimation(true);
    setTimeout(() => {
      setShowAddAnimation(false);
    }, 1000);
  };

  // Update local cart (for non-logged in users or API fallback)
  const updateLocalCart = (food) => {
    const existingItemIndex = cart.findIndex((item) => item._id === food._id);

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: (updatedCart[existingItemIndex].quantity || 1) + 1,
      };
      setCart(updatedCart);
    } else {
      const newItem = { ...food, quantity: 1 };
      setCart((prev) => [...prev, newItem]);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (index) => {
    const item = cart[index];

    if (isUserAuthenticated()) {
      const result = await removeFromCartAPI(item._id);
      if (result && result.success) {
        await fetchCartFromAPI();
      } else {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
      }
    } else {
      const updatedCart = cart.filter((_, i) => i !== index);
      setCart(updatedCart);
    }
  };

  // Update item quantity in cart
  const updateQuantity = async (index, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(index);
      return;
    }

    const item = cart[index];

    if (isUserAuthenticated()) {
      const currentQuantity = item.quantity || 1;
      const difference = newQuantity - currentQuantity;

      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          await addToCartAPI(item._id);
        }
      } else if (difference < 0) {
        for (let i = 0; i < Math.abs(difference); i++) {
          await removeFromCartAPI(item._id);
        }
      }

      await fetchCartFromAPI();
    } else {
      const updatedCart = [...cart];
      updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
      setCart(updatedCart);
    }
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
  const clearCart = async () => {
    if (isUserAuthenticated()) {
      for (const item of cart) {
        for (let i = 0; i < (item.quantity || 1); i++) {
          await removeFromCartAPI(item._id);
        }
      }
      await fetchCartFromAPI();
    } else {
      setCart([]);
      localStorage.removeItem("guestCart");
    }
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

  // Handle checkout navigation
  const handleCheckout = () => {
    setIsModalOpen(false);
    navigate("/checkout", {
      state: {
        cart: cart,
        total: getCartTotal(),
      },
    });
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
              Welcome back, {user.name}! (ID: {getUserId()})
            </p>
          )}
          {!isUserAuthenticated() && cart.length > 0 && (
            <p className="text-center text-xs text-orange-600 dark:text-orange-400 mt-2">
              Sign in to save your cart across devices
            </p>
          )}
        </motion.div>
      </div>

      {/* Floating Cart Button */}
      <motion.button
        className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-900 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center hover:bg-red-800 transition-colors duration-200"
        whileHover={{ scale: 1.05, rotate: [0, -10, 10, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        disabled={cartLoading}
      >
        {cartLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <ChefHat size={24} />
          </motion.div>
        ) : (
          <ShoppingCart size={24} />
        )}
        <AnimatePresence>
          {cart.length > 0 && !cartLoading && (
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

        {/* Food Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence>
            {filteredFoods.map((food, index) => (
              <motion.div
                key={food._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => openProductModal(food)}
              >
                <div className="relative h-48 overflow-hidden cursor-pointer">
                  <img
                    src={food.images[0]}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {food.isOnOffer && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      OFFER!
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(food._id);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={`${
                        favorites.includes(food._id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-2 line-clamp-2">
                    {food.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {food.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-orange-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {food.cookingTime} min
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Utensils size={14} className="text-orange-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {food.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {food.isOnOffer ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            KSh. {food.offerPrice}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            KSh. {food.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-red-900 dark:text-orange-500">
                          KSh. {food.price}
                        </span>
                      )}
                    </div>

                    <motion.button
                      className="bg-red-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-800 transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaceOrder(food);
                      }}
                    >
                      <Plus size={16} />
                      Add
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cart Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Your Cart ({getTotalCartQuantity()} items)
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={24} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart
                      size={64}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                      Your cart is empty
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      Add some delicious items to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <motion.div
                        key={`${item._id}-${index}`}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 dark:text-white">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            KSh. {item.isOnOffer ? item.offerPrice : item.price}{" "}
                            each
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(index, (item.quantity || 1) - 1)
                            }
                            className="p-1 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold text-gray-800 dark:text-white min-w-[20px] text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(index, (item.quantity || 1) + 1)
                            }
                            className="p-1 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800 dark:text-white">
                            KSh.{" "}
                            {(
                              (item.isOnOffer ? item.offerPrice : item.price) *
                              (item.quantity || 1)
                            ).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveFromCart(index)}
                            className="text-red-500 hover:text-red-700 text-sm mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-gray-800 dark:text-white">
                      Total: KSh. {getCartTotal().toFixed(2)}
                    </span>
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Clear Cart
                    </button>
                  </div>
                  <motion.button
                    onClick={handleCheckout}
                    className="w-full bg-red-900 text-white py-3 rounded-lg font-medium hover:bg-red-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Proceed to Checkout
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/2 relative">
                  <div className="relative h-64 md:h-96">
                    <img
                      src={selectedProduct.images[currentImageIndex]}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedProduct.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </div>
                  {selectedProduct.images.length > 1 && (
                    <div className="flex justify-center gap-2 p-4">
                      {selectedProduct.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex
                              ? "bg-red-500"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="md:w-1/2 p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {selectedProduct.name}
                    </h2>
                    <button
                      onClick={closeProductModal}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X
                        size={24}
                        className="text-gray-600 dark:text-gray-300"
                      />
                    </button>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedProduct.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-orange-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedProduct.cookingTime} minutes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChefHat size={16} className="text-orange-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedProduct.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    {selectedProduct.isOnOffer ? (
                      <>
                        <span className="text-2xl font-bold text-red-600">
                          KSh. {selectedProduct.offerPrice}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          KSh. {selectedProduct.price}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                          {Math.round(
                            ((selectedProduct.price -
                              selectedProduct.offerPrice) /
                              selectedProduct.price) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-red-900 dark:text-orange-500">
                        KSh. {selectedProduct.price}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto">
                    <motion.button
                      onClick={() => {
                        handlePlaceOrder(selectedProduct);
                        closeProductModal();
                      }}
                      className="w-full bg-red-900 text-white py-3 rounded-lg font-medium hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={20} />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodSlider;
