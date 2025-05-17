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
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Food Tags
  const foodTags = [
    "Very Cold",
    "Hot Hot",
    "Very Sweet",
    "Best Seller",
    "Filling",
    "Affordable",
  ];

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
        setIsLoaded(true);
      }
    };
    fetchFoods();
  }, []);

  // Auto-rotate featured items
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingFoodIndex(
        (prev) => (prev + 1) % (foods.length > 0 ? foods.length : 1)
      );
    }, 8000);
    return () => clearInterval(interval);
  }, [foods.length]);

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

  // Remove item from cart
  const handleRemoveFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
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

      {/* Floating Cart Button */}
      <motion.button
        className="fixed top-6 right-6 bg-red-900 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center hover:bg-red-800 transition-colors duration-200"
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
              className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
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

            {/* Filter Dropdown */}
            <div
              className={`mt-3 bg-white rounded-xl shadow-lg p-4 transition-all duration-300 ${
                isFilterOpen
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget Input Field */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Enter Your Budget (KSh)
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="3000"
                        step="50"
                        className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-red-900 focus:border-red-900 transition-colors text-gray-700"
                        value={maxBudget}
                        onChange={(e) =>
                          setMaxBudget(parseInt(e.target.value) || 0)
                        }
                        placeholder="Max budget amount"
                      />
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">
                      Shows dishes KSh {maxBudget} and below
                    </div>
                  </div>
                </div>

                {/* Food Tags */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Criteria</h3>
                  <div className="flex flex-wrap gap-2">
                    {foodTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? "bg-red-900 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="text-gray-600 hover:text-gray-800 text-sm mr-4"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="bg-red-900 text-white px-4 py-1 rounded-full text-sm hover:bg-red-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Category Navigation (Horizontal Scroll) */}
        <div className="block lg:hidden mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          <div
            className={`flex space-x-2 transition-all duration-1000 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full transition-all ${
                  activeCategory === category
                    ? "bg-red-900 text-white font-medium shadow"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <span>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area with Categories and Menu Items */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Section - Left Side (Desktop only) */}
          <div
            className={`hidden lg:block lg:col-span-1 transition-all duration-1000 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-4">
              {/* Category Header */}
              <div className="bg-red-900 text-white py-4 px-6">
                <h2 className="text-xl font-bold flex items-center">
                  <span>Menu Categories</span>
                  <span className="ml-2">🍴</span>
                </h2>
              </div>

              {/* Category List */}
              <div className="py-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full text-left px-6 py-3 transition-all flex items-center justify-between ${
                      activeCategory === category
                        ? "bg-orange-50 border-l-4 border-red-900 font-medium text-red-900"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                    {activeCategory === category && (
                      <span className="text-lg">
                        {category === "meat"
                          ? "🥩"
                          : category === "vegetarian"
                          ? "🥗"
                          : category === "seafood"
                          ? "🐟"
                          : category === "drinks"
                          ? "🥤"
                          : "🍽️"}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Featured Item */}
              {foods.length > 0 && (
                <div className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100">
                  <div className="text-center">
                    <div className="mb-2 text-sm font-semibold text-orange-600">
                      Today's Special
                    </div>
                    <div className="relative inline-block">
                      <img
                        src={foods[rotatingFoodIndex % foods.length].images[0]}
                        alt={foods[rotatingFoodIndex % foods.length].name}
                        className="h-24 w-24 object-cover rounded-full mx-auto border-2 border-orange-300"
                      />
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                        HOT!
                      </div>
                    </div>
                    <div className="mt-2 font-medium">
                      {foods[rotatingFoodIndex % foods.length].name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {foods[rotatingFoodIndex % foods.length].isOnOffer ? (
                        <>
                          <span className="line-through text-gray-500 mr-2">
                            KSh {foods[rotatingFoodIndex % foods.length].price}
                          </span>
                          <span className="text-red-900 font-bold">
                            KSh{" "}
                            {foods[rotatingFoodIndex % foods.length].offerPrice}
                          </span>
                        </>
                      ) : (
                        <span className="text-red-900 font-bold">
                          KSh {foods[rotatingFoodIndex % foods.length].price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items - Right Side */}
          <div
            className={`lg:col-span-3 transition-all duration-1000 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "translate-x-20 opacity-0"
            }`}
          >
            {/* Header with Info */}
            <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {activeCategory === "all"
                    ? "All Menu Items"
                    : activeCategory.charAt(0).toUpperCase() +
                      activeCategory.slice(1)}
                  <span className="ml-2 text-gray-500 text-lg font-normal">
                    ({filteredItems.length} items)
                  </span>
                </h2>

                {/* Custom Message for Category */}
                <div className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-medium">
                  {activeCategory === "meat"
                    ? "Hot Grilled Meat!"
                    : activeCategory === "vegetarian"
                    ? "Fresh Veggies!"
                    : activeCategory === "seafood"
                    ? "Coastal Special!"
                    : activeCategory === "drinks"
                    ? "Very Cold!"
                    : "Delicious Options!"}
                </div>
              </div>

              {searchTerm && filteredItems.length === 0 && (
                <div className="mt-4 text-center py-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    No menu items for "
                    <span className="font-medium">{searchTerm}</span>"
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-sm text-red-900 hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>

            {/* Menu Items Grid */}
            <div
              ref={menuRef}
              className="bg-white rounded-b-2xl shadow-lg overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 p-6 gap-6">
                {filteredItems.map((item, index) => (
                  <div
                    key={item._id}
                    className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                      hoveredItem === index
                        ? "shadow-xl transform -translate-y-1"
                        : "shadow-md hover:shadow-lg"
                    }`}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Food Image with Steam Effect */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                        style={{
                          transform:
                            hoveredItem === index ? "scale(1.1)" : "scale(1)",
                        }}
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item._id);
                        }}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md z-10"
                      >
                        <Heart
                          size={16}
                          className={
                            favorites.includes(item._id)
                              ? "fill-red-900 text-red-900"
                              : "text-gray-400"
                          }
                        />
                      </button>

                      {/* Special Tags */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {item.isOnOffer && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {Math.round(
                              (1 - item.offerPrice / item.price) * 100
                            )}
                            % OFF
                          </span>
                        )}
                      </div>

                      {/* Item price */}
                      <div className="absolute bottom-4 right-4 bg-white/90 text-red-900 font-bold px-3 py-1 rounded-full shadow-lg">
                        {item.isOnOffer ? (
                          <>
                            <span className="line-through text-xs mr-1 text-gray-500">
                              KSh {item.price}
                            </span>
                            KSh {item.offerPrice}
                          </>
                        ) : (
                          `KSh ${item.price}`
                        )}
                      </div>

                      {/* Item name */}
                      <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl drop-shadow-lg">
                        {item.name}
                      </h3>
                    </div>

                    {/* Item Details */}
                    <div className="p-4">
                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(item.rating || 4.5)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {item.rating || 4.5}
                        </span>
                        <span className="ml-1 flex items-center text-gray-500">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          <span className="text-xs">
                            {Math.floor(Math.random() * 100) + 50}
                          </span>
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3">
                        {item.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.category && (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            {item.category}
                          </span>
                        )}
                        {item.isSpicy && (
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                            Hot Hot
                          </span>
                        )}
                        {item.isCold && (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                            Very Cold
                          </span>
                        )}
                        {item.price < 500 && (
                          <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-600">
                            Affordable
                          </span>
                        )}
                      </div>

                      {/* Order Button */}
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => handlePlaceOrder(item)}
                          className="flex items-center bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-full transition-colors text-sm"
                        >
                          <PlusCircle className="w-4 h-4 mr-1" />
                          Add to Order
                        </button>
                        <button className="text-gray-500 hover:text-red-900 text-sm underline">
                          More Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty state when no items match */}
              {filteredItems.length === 0 && !searchTerm && (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No items found
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Try adjusting your filters or budget to see more delicious
                    options!
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 bg-red-900 text-white px-6 py-2 rounded-full hover:bg-red-800 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* "Load More" Button (shown when there are many items) */}
            {filteredItems.length > 4 && (
              <div className="mt-6 text-center">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-full transition-colors inline-flex items-center">
                  <span>Load More Items</span>
                  <ChevronDown className="ml-2 w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer message with Animation */}
        <div className="mt-12 text-center px-4">
          <div
            className={`transition-all duration-1000 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <p className="text-gray-500 italic">
              Enhance your experience by using our filters to find dishes that
              suit your taste!
            </p>
            <p className="text-gray-600 font-medium mt-2">
              Need assistance with your order? Call us at{" "}
              <span className="text-red-900">+254 712 345 678</span>
            </p>
          </div>
        </div>
      </div>

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
              className={`fixed bottom-0 left-0 w-full max-h-[80vh] rounded-t-lg bg-white shadow-2xl p-6 overflow-y-auto z-[9999]`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-900">Your Order</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200"
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
                        className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 group relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={food.images[0]}
                          alt={food.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                        <div className="flex-1">
                          <p className="text-base font-semibold text-gray-800">
                            {food.name}
                          </p>
                          <p className="text-red-900 text-lg font-bold">
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
                    className="mt-6 border-t border-gray-200 pt-4"
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

                      <div className="h-px bg-gray-200 my-3"></div>

                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-gray-800">Total</span>
                        <span className="text-red-900">
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
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg flex items-center gap-3 border border-amber-100">
                      <Clock size={20} className="text-amber-500" />
                      <div>
                        <p className="font-medium text-gray-800">
                          Estimated Delivery
                        </p>
                        <p className="text-gray-600 text-sm">25-40 minutes</p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <motion.button
                      className="w-full mt-6 py-4 bg-red-900 rounded-lg text-white font-bold uppercase shadow-lg hover:bg-red-800"
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
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <ShoppingCart size={48} className="text-gray-300" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 text-center mb-6">
                    Looks like you haven't added anything to your cart yet
                  </p>
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-red-900 text-white rounded-lg font-medium hover:bg-red-800 transition-colors"
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

export default Menu;
