import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Star,
  Filter,
  ChevronDown,
  ThumbsUp,
  PlusCircle,
  Tag,
  DollarSign,
  ShoppingCart,
  X,
  Heart,
  Clock,
  Utensils,
  Minus,
  Plus,
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [maxBudget, setMaxBudget] = useState(3000);
  const [selectedTags, setSelectedTags] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [rotatingFoodIndex, setRotatingFoodIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(["all"]);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const [user, setUser] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [token, setToken] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Base API URL
  const API_BASE_URL = "http://localhost:4000/api";

  // Food Tags
  const foodTags = [
    "Very Cold",
    "Hot Hot",
    "Very Sweet",
    "Best Seller",
    "Filling",
    "Affordable",
  ];

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  };

  // Clear authentication data
  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    console.log("Authentication data cleared");
  };

  // Get fresh authentication data
  const refreshAuthData = () => {
    const authToken = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log("Refreshing auth data - Token:", authToken ? "exists" : "null");

    if (authToken) {
      if (isTokenExpired(authToken)) {
        console.log("Token is expired, clearing auth data");
        clearAuthData();
        return false;
      }
      setToken(authToken);
    } else {
      setToken(null);
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log("User data refreshed:", parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    return !!(authToken && !isTokenExpired(authToken));
  };

  // Get authentication token and user from localStorage
  useEffect(() => {
    refreshAuthData();
  }, []);

  // Listen to localStorage changes (for when user logs in from another component)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        console.log("Storage changed, refreshing auth data");
        refreshAuthData();
      }
    };

    // Listen to storage events
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for auth changes (for same-tab updates)
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== token) {
        console.log("Token changed, refreshing auth data");
        refreshAuthData();
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [token]);

  // Check if user is authenticated
  const isUserAuthenticated = () => {
    const currentToken = token || localStorage.getItem("token");
    const currentUser =
      user ||
      (() => {
        try {
          const userData = localStorage.getItem("user");
          return userData ? JSON.parse(userData) : null;
        } catch {
          return null;
        }
      })();

    const isAuthenticated = !!(
      currentToken &&
      !isTokenExpired(currentToken) &&
      currentUser &&
      (currentUser.id || currentUser._id)
    );

    if (!isAuthenticated && (currentToken || currentUser)) {
      console.log(
        "User appears logged out or token expired, clearing stale data"
      );
      clearAuthData();
    }

    return isAuthenticated;
  };

  // Get user ID from user object
  const getUserId = () => {
    const currentUser =
      user ||
      (() => {
        try {
          const userData = localStorage.getItem("user");
          return userData ? JSON.parse(userData) : null;
        } catch {
          return null;
        }
      })();

    if (!currentUser) return null;
    return currentUser.id || currentUser._id || null;
  };

  // Get auth headers for API calls with fresh token
  const getAuthHeaders = () => {
    const currentToken = token || localStorage.getItem("token");
    // console.log("this is the token", currentToken);

    if (currentToken && !isTokenExpired(currentToken)) {
      return {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      };
    }

    // If token is expired, clear it
    if (currentToken && isTokenExpired(currentToken)) {
      console.log("Token expired, clearing auth data");
      clearAuthData();
    }

    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  };

  // Enhanced API error handler
  const handleApiError = (error, actionName) => {
    console.error(`Error in ${actionName}:`, error);

    if (error.response?.status === 401) {
      console.log(`401 error in ${actionName}, clearing authentication`);
      clearAuthData();
      // Optionally redirect to login
      // navigate('/login');
      return false;
    }

    return true;
  };

  // Fetch foods from API and extract unique categories
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/food/`);
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
        console.error("Error fetching foods:", err);
        setError("Failed to load food data.");
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };
    fetchFoods();
  }, []);

  // Load cart after foods are loaded
  useEffect(() => {
    if (foods.length > 0) {
      loadCart();
    }
  }, [foods, user, token]);

  // Save guest cart to localStorage whenever cart changes (for non-logged in users)
  useEffect(() => {
    if (!isUserAuthenticated()) {
      localStorage.setItem("guestCart", JSON.stringify(cart));
    }
  }, [cart, user, token]);

  // Load cart based on authentication status
  const loadCart = async () => {
    if (isUserAuthenticated()) {
      // User is logged in - fetch from API and merge with local cart
      await handleLoginCartMerge();
    } else {
      // User not logged in - load from localStorage
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

  // Auto-rotate featured items
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingFoodIndex(
        (prev) => (prev + 1) % (foods.length > 0 ? foods.length : 1)
      );
    }, 8000);
    return () => clearInterval(interval);
  }, [foods.length]);

  // Handle cart merging when user logs in
  const handleLoginCartMerge = async () => {
    const userId = getUserId();
    if (!userId) return;

    setCartLoading(true);
    try {
      // Get guest cart from localStorage
      const guestCart = localStorage.getItem("guestCart");
      let guestCartItems = [];

      if (guestCart) {
        try {
          guestCartItems = JSON.parse(guestCart);
        } catch (error) {
          console.error("Error parsing guest cart:", error);
        }
      }

      // Merge guest cart items with server cart if there are any
      if (guestCartItems.length > 0) {
        console.log("Merging guest cart with server cart...");

        // Send each guest cart item to the server
        for (const guestItem of guestCartItems) {
          const quantity = guestItem.quantity || 1;

          // Add items one by one to maintain proper quantity
          for (let i = 0; i < quantity; i++) {
            try {
              await axios.post(
                `${API_BASE_URL}/cart/add`,
                {
                  itemId: guestItem._id,
                },
                getAuthHeaders()
              );
            } catch (error) {
              if (!handleApiError(error, "merge guest cart item")) {
                break; // Stop if auth error
              }
            }
          }
        }

        // Clear guest cart after successful merge
        localStorage.removeItem("guestCart");
      }

      // Fetch updated cart from server
      await fetchCartFromAPI();
    } catch (error) {
      handleApiError(error, "cart merge");
      // Fallback to guest cart if API fails
      const guestCart = localStorage.getItem("guestCart");
      if (guestCart) {
        try {
          setCart(JSON.parse(guestCart));
        } catch (parseError) {
          console.error("Error parsing fallback cart:", parseError);
        }
      }
    } finally {
      setCartLoading(false);
    }
  };

  // Fetch cart items from API
  const fetchCartFromAPI = async () => {
    if (!isUserAuthenticated()) {
      console.log("User not authenticated, skipping API cart fetch");
      return;
    }

    setCartLoading(true);
    try {
      console.log("Fetching cart from API...");
      const response = await axios.get(
        `${API_BASE_URL}/cart/get`,
        getAuthHeaders()
      );

      console.log("Cart API response:", response.data);

      if (response.data.success && response.data.cartData) {
        // Convert API cart data to local cart format
        const cartData = response.data.cartData;
        const cartItems = [];

        // For each item ID in cart data, find the food item and add quantity
        for (const [itemId, quantity] of Object.entries(cartData)) {
          const foodItem = foods.find((food) => food._id === itemId);
          if (foodItem && quantity > 0) {
            cartItems.push({ ...foodItem, quantity });
          }
        }

        console.log("Processed cart items:", cartItems);
        setCart(cartItems);
      } else {
        console.log("No cart data found or unsuccessful response");
        setCart([]);
      }
    } catch (error) {
      handleApiError(error, "fetch cart errors");
    } finally {
      setCartLoading(false);
    }
  };

  // Add item to cart via API (for logged-in users)
  const addToCartAPI = async (itemId) => {
    try {
      console.log("Adding item to cart via API:", itemId);
      const response = await axios.post(
        `${API_BASE_URL}/cart/add`,
        {
          itemId: itemId,
        },
        currentToken
      );
      console.log("Add to cart API response:", response.data);
      return response.data;
    } catch (error) {
      if (handleApiError(error, "add to cart")) {
        // Non-auth error, return null to trigger fallback
        return null;
      }
      return null;
    }
  };

  // Remove item from cart via API
  const removeFromCartAPI = async (itemId) => {
    try {
      console.log("Removing item from cart via API:", itemId);
      const response = await axios.delete(
        `${API_BASE_URL}/cart/remove/${itemId}`,
        getAuthHeaders()
      );
      console.log("Remove from cart API response:", response.data);
      return response.data;
    } catch (error) {
      if (handleApiError(error, "remove from cart")) {
        return null;
      }
      return null;
    }
  };

  // Handle adding to cart with animation and persistence
  const handlePlaceOrder = async (food) => {
    if ("vibrate" in navigator) navigator.vibrate(50);

    if (isUserAuthenticated()) {
      // User is logged in - use API
      console.log("Adding to cart via API for item:", food._id);
      const result = await addToCartAPI(food._id);
      if (result && result.success) {
        // Refresh cart from API
        await fetchCartFromAPI();
      } else {
        // Fallback to local storage if API fails
        console.log("API failed, falling back to local storage");
        updateLocalCart(food);
      }
    } else {
      // User not logged in - use local storage (guest cart)
      console.log("Adding to guest cart");
      updateLocalCart(food);
    }

    // Show animation
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
  };

  // Remove item from cart
  const handleRemoveFromCart = async (index) => {
    const item = cart[index];

    if (isUserAuthenticated()) {
      // User is logged in - use API
      const result = await removeFromCartAPI(item._id);
      if (result && result.success) {
        // Refresh cart from API
        await fetchCartFromAPI();
      } else {
        // Fallback to local removal if API fails
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
      }
    } else {
      // User not logged in - remove from local storage (guest cart)
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
      // For logged-in users, we need to add/remove items to achieve the desired quantity
      const currentQuantity = item.quantity || 1;
      const difference = newQuantity - currentQuantity;

      if (difference > 0) {
        // Add more items
        for (let i = 0; i < difference; i++) {
          await addToCartAPI(item._id);
        }
      } else if (difference < 0) {
        // Remove items (need to call remove API multiple times)
        for (let i = 0; i < Math.abs(difference); i++) {
          await removeFromCartAPI(item._id);
        }
      }

      // Refresh cart from API
      await fetchCartFromAPI();
    } else {
      // User not logged in - update local storage (guest cart)
      const updatedCart = [...cart];
      updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
      setCart(updatedCart);
    }
  };

  // Get total cart quantity
  const getTotalCartQuantity = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const handleCheckout = () => {
    setIsModalOpen(false);
    navigate("/checkout", {
      state: {
        cart: cart,
        total: getCartTotal(),
      },
    });
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
      // For logged-in users, remove all items via API
      for (const item of cart) {
        for (let i = 0; i < (item.quantity || 1); i++) {
          await removeFromCartAPI(item._id);
        }
      }
      await fetchCartFromAPI();
    } else {
      // For non-logged-in users, clear guest cart
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

  // Filter menu items based on search term, category, and filters
  const getFilteredMenuItems = () => {
    let items = foods;

    // Category filter
    if (activeCategory !== "all") {
      items = items.filter(
        (food) => food.category.toLowerCase() === activeCategory
      );
    }

    // Search filter
    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Price (budget) filter
    items = items.filter((item) => {
      const price = item.isOnOffer ? item.offerPrice : item.price;
      return price <= maxBudget;
    });

    // Tags filter
    if (selectedTags.length > 0) {
      items = items.filter((item) =>
        selectedTags.some((tag) => {
          if (tag === "Hot Hot") return item.isSpicy;
          if (tag === "Very Cold") return item.isCold;
          if (tag === "Best Seller") return item.isPopular;
          if (tag === "Very Sweet") return item.isSweet;
          if (tag === "Filling") return item.isFilling;
          if (tag === "Affordable") return item.price < 500;
          return false;
        })
      );
    }

    return items;
  };

  // Handle category change
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (menuRef.current) {
      menuRef.current.scrollTop = 0;
    }
  };

  // Toggle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setMaxBudget(3000);
    setSelectedTags([]);
    setSearchTerm("");
    setActiveCategory("all");
  };

  // Format price
  const formatPrice = (price) => {
    return `KSh ${price}`;
  };

  const filteredItems = getFilteredMenuItems();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="p-8 rounded-xl bg-white shadow-lg">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-4"
            >
              <Utensils size={32} className="text-red-900" />
            </motion.div>
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-red-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-red-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-red-200 rounded"></div>
                  <div className="h-4 bg-red-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-red-900 font-medium">
              Loading the delicious menu...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="p-8 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-900 text-white rounded-full hover:bg-red-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 relative w-full min-h-screen bg-gradient-to-b from-orange-50 to-white overflow-hidden py-8">
      {/* Background - Rotating Star Food Items */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {foods.slice(0, 6).map((food, index) => (
          <div
            key={food._id}
            className="absolute"
            style={{
              top: `${Math.random() * 90 + 5}%`,
              left: `${Math.random() * 90 + 5}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              zIndex: 0,
              opacity: 0.07,
              width: `${Math.random() * 30 + 40}px`,
              height: `${Math.random() * 30 + 40}px`,
            }}
          >
            <img
              src={food.images[0]}
              alt={food.name}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        ))}
      </div>

      {/* Auth Status Debug (Remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed top-20 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>Auth: {isUserAuthenticated() ? "Yes" : "No"}</div>
          <div>Token: {token ? "Exists" : "None"}</div>
          <div>User: {user?.email || "None"}</div>
          <div>
            Expired: {token ? (isTokenExpired(token) ? "Yes" : "No") : "N/A"}
          </div>
        </div>
      )}

      {/* Rest of your component remains the same... */}
      {/* Floating Cart Button - Centered */}
      <motion.button
        className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-red-900 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center hover:bg-red-800 transition-colors duration-200"
        whileHover={{ scale: 1.05, rotate: [0, -10, 10, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
      >
        <ShoppingCart size={24} />
        <AnimatePresence>
          {getTotalCartQuantity() > 0 && (
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
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

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section with entrance animation */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                <span className="text-red-900">Food</span> Menu
                <span className="inline-block ml-2">🍽️</span>
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Taste the authentic flavors with our
                <span className="relative mx-1 font-semibold">
                  mouthwatering dishes
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300"></span>
                </span>
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-4 md:mt-0 relative">
              <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-2 shadow-sm hover:shadow transition-shadow">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search food..."
                  className="ml-2 outline-none flex-1 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Animated search cue */}
              {!searchTerm && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                  Try "
                  {foods.length > 0 ? foods[0].name.split(" ")[0] : "Grill"}"
                </div>
              )}
            </div>
          </div>

          {/* Filter Section */}
          <div className="mt-6">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-full text-gray-700"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Filter Panel */}
            {isFilterOpen && (
              <div className="mt-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Budget Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="inline w-4 h-4 mr-1" />
                      Max Budget: KSh {maxBudget}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="3000"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>KSh 100</span>
                      <span>KSh 3000</span>
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="inline w-4 h-4 mr-1" />
                      Food Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {foodTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? "bg-red-900 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reset Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="text-red-900 hover:text-red-700 font-medium text-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-6 py-3 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-red-900 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredItems.length}</span>{" "}
            delicious items
            {searchTerm && (
              <span>
                {" "}
                for "<span className="font-semibold">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Menu Grid */}
        <div
          ref={menuRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-screen overflow-y-auto"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((food, index) => (
              <div
                key={food._id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 0.1}s`,
                }}
                onMouseEnter={() => setHoveredItem(food._id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Food Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={food.images[0]}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay Tags */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {food.isOnOffer && (
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Offer
                      </span>
                    )}
                    {food.isPopular && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Popular
                      </span>
                    )}
                    {food.isSpicy && (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        🔥 Spicy
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(food._id);
                    }}
                    className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(food._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>

                  {/* Quick Add Button - Shows on Hover */}
                  <div
                    className={`absolute bottom-3 right-3 transition-all duration-300 ${
                      hoveredItem === food._id
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaceOrder(food);
                      }}
                      className="bg-red-900 text-white p-2 rounded-full hover:bg-red-800 transition-colors shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Food Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                      {food.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-600">
                        {food.rating || "4.5"}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {food.description || "Delicious and freshly prepared"}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {food.isCold && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Cold
                      </span>
                    )}
                    {food.isSweet && (
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                        Sweet
                      </span>
                    )}
                    {food.isFilling && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Filling
                      </span>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-800">
                      {food.isOnOffer ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">
                            {formatPrice(food.offerPrice)}
                          </span>
                          <span className="line-through text-gray-500 text-sm">
                            {formatPrice(food.price)}
                          </span>
                        </div>
                      ) : (
                        formatPrice(food.price)
                      )}
                    </div>

                    <button
                      onClick={() => handlePlaceOrder(food)}
                      className="bg-red-900 text-white px-4 py-2 rounded-full hover:bg-red-800 transition-colors flex items-center space-x-2 text-sm font-medium"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Preparation Time */}
                  <div className="flex items-center justify-center mt-3 text-gray-500 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{food.prepTime || "15-20"} mins</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No items found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={resetFilters}
                className="bg-red-900 text-white px-6 py-3 rounded-full hover:bg-red-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-6 h-6 text-red-900" />
                <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                {getTotalCartQuantity() > 0 && (
                  <span className="bg-red-900 text-white px-3 py-1 rounded-full text-sm">
                    {getTotalCartQuantity()} items
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {cart.length > 0 ? (
                <div className="p-6 space-y-4">
                  {cart.map((item, index) => (
                    <div
                      key={`${item._id}-${index}`}
                      className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatPrice(
                            item.isOnOffer ? item.offerPrice : item.price
                          )}{" "}
                          each
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(index, (item.quantity || 1) - 1)
                          }
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold min-w-[2rem] text-center">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(index, (item.quantity || 1) + 1)
                          }
                          className="w-8 h-8 rounded-full bg-red-900 hover:bg-red-800 text-white flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          {formatPrice(
                            (item.isOnOffer ? item.offerPrice : item.price) *
                              (item.quantity || 1)
                          )}
                        </p>
                        <button
                          onClick={() => handleRemoveFromCart(index)}
                          className="text-red-500 hover:text-red-700 text-sm mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500">
                    Add some delicious items to get started!
                  </p>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-800">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-red-900">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="flex-2 bg-red-900 text-white py-3 px-6 rounded-xl hover:bg-red-800 transition-colors font-medium"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading overlay for cart operations */}
      {cartLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-900"></div>
              <span className="text-gray-700">Updating cart...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
