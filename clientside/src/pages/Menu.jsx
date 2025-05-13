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
} from "lucide-react";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Grilled Meat");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [maxBudget, setMaxBudget] = useState(3000);
  const [selectedTags, setSelectedTags] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [rotatingFoodIndex, setRotatingFoodIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const menuRef = useRef(null);

  // Food Categories
  const menuCategories = [
    "Grilled Meat",
    "Staple Combos",
    "Street Food",
    "Coastal Dishes",
    "Local Drinks",
    "Special Fries",
  ];

  // Food Tags
  const foodTags = [
    "Very Cold",
    "Hot Hot",
    "Very Sweet",
    "Best Seller",
    "Filling",
    "Affordable",
  ];

  // Placeholder images for demo
  const placeholderImages = {
    food1: "/api/placeholder/300/200",
    food2: "/api/placeholder/300/200",
    food3: "/api/placeholder/300/200",
    food4: "/api/placeholder/300/200",
  };

  // Menu items with dishes
  const menuItems = {
    "Grilled Meat": [
      {
        name: "Goat Grill Deluxe",
        price: 850,
        image: placeholderImages.food1,
        description:
          "Succulent goat meat marinated with spices, slow-roasted over open flames",
        rating: 4.9,
        tags: ["Hot Hot", "Best Seller", "Filling"],
        isPopular: true,
      },
      {
        name: "Chicken Grill Combo",
        price: 650,
        image: placeholderImages.food2,
        description: "Grilled chicken with salad, served with ugali or chips",
        rating: 4.7,
        tags: ["Affordable", "Hot Hot"],
        isHealthy: true,
      },
      {
        name: "Mixed Grill Platter",
        price: 1200,
        image: placeholderImages.food3,
        description:
          "Mix of beef, goat and chicken with roasted potatoes and salad",
        rating: 4.8,
        tags: ["Filling", "Best Seller"],
        isNew: true,
      },
    ],
    "Staple Combos": [
      {
        name: "Ugali with Greens",
        price: 350,
        image: placeholderImages.food1,
        description: "Fresh greens served with hot ugali and meat stew",
        rating: 4.5,
        tags: ["Affordable", "Filling"],
        isHealthy: true,
      },
      {
        name: "Ugali with Fish",
        price: 650,
        image: placeholderImages.food2,
        description: "Fresh tilapia served with ugali and local vegetables",
        rating: 4.8,
        tags: ["Hot Hot", "Best Seller"],
        isPopular: true,
      },
      {
        name: "Ugali with Beef",
        price: 550,
        image: placeholderImages.food3,
        description:
          "Tender beef stew with perfectly cooked ugali and steamed vegetables",
        rating: 4.6,
        tags: ["Filling", "Affordable"],
        isNew: true,
      },
    ],
    "Street Food": [
      {
        name: "Sausage Special",
        price: 150,
        image: placeholderImages.food1,
        description: "Split sausage with salad and special sauce",
        rating: 4.7,
        tags: ["Affordable", "Best Seller"],
        isPopular: true,
      },
      {
        name: "Special Sausage",
        price: 200,
        image: placeholderImages.food2,
        description: "Traditional sausage made with meat and spices",
        rating: 4.6,
        tags: ["Hot Hot"],
        isNew: true,
      },
      {
        name: "Roasted Corn",
        price: 100,
        image: placeholderImages.food3,
        description: "Roasted maize cobs with lemon-chili salt",
        rating: 4.5,
        tags: ["Affordable", "Hot Hot"],
        isVegetarian: true,
      },
    ],
    "Coastal Dishes": [
      {
        name: "Chicken Biryani",
        price: 550,
        image: placeholderImages.food1,
        description:
          "Spiced rice dish with chicken, potatoes and special spices",
        rating: 4.8,
        tags: ["Hot Hot", "Filling"],
        isPopular: true,
      },
      {
        name: "Fish in Coconut",
        price: 750,
        image: placeholderImages.food2,
        description: "Fish in rich coconut sauce with garlic and tamarind",
        rating: 4.9,
        tags: ["Best Seller", "Hot Hot"],
        isNew: true,
      },
      {
        name: "Fried Bread with Peas",
        price: 350,
        image: placeholderImages.food3,
        description:
          "Sweet fried bread served with pigeon peas in coconut sauce",
        rating: 4.6,
        tags: ["Affordable", "Very Sweet"],
        isVegetarian: true,
      },
    ],
    "Local Drinks": [
      {
        name: "Ginger Ice",
        price: 150,
        image: placeholderImages.food1,
        description: "Refreshing ginger drink with lime and honey",
        rating: 4.7,
        tags: ["Very Cold", "Best Seller"],
        isHealthy: true,
      },
      {
        name: "Passion Cocktail",
        price: 200,
        image: placeholderImages.food2,
        description: "Passion fruit cocktail with local honey and lime",
        rating: 4.8,
        tags: ["Very Cold", "Very Sweet"],
        isPopular: true,
      },
      {
        name: "Tamarind Shake",
        price: 180,
        image: placeholderImages.food3,
        description: "Tamarind drink blended with ice and brown sugar",
        rating: 4.6,
        tags: ["Very Cold", "Affordable"],
        isNew: true,
      },
    ],
    "Special Fries": [
      {
        name: "Supreme Fries",
        price: 450,
        image: placeholderImages.food1,
        description:
          "Our signature fries topped with minced meat, cheese and special sauce",
        rating: 4.9,
        tags: ["Best Seller", "Filling"],
        isPopular: true,
      },
      {
        name: "Spiced Fries",
        price: 350,
        image: placeholderImages.food2,
        description: "Crispy fries tossed in special spices",
        rating: 4.7,
        tags: ["Hot Hot", "Affordable"],
        isNew: true,
      },
      {
        name: "Salad Fries",
        price: 400,
        image: placeholderImages.food3,
        description: "Fries topped with fresh salad and avocado",
        rating: 4.6,
        tags: ["Affordable", "Hot Hot"],
        isHealthy: true,
      },
    ],
  };

  // Star food items that rotate in the background
  const starFoodItems = [
    {
      name: "Supreme Fries",
      image: placeholderImages.food1,
    },
    {
      name: "Goat Grill",
      image: placeholderImages.food2,
    },
    {
      name: "Chicken Biryani",
      image: placeholderImages.food3,
    },
    {
      name: "Ugali with Fish",
      image: placeholderImages.food4,
    },
    {
      name: "Sausage Special",
      image: placeholderImages.food1,
    },
    {
      name: "Passion Cocktail",
      image: placeholderImages.food2,
    },
  ];

  // Generate star positions
  const starPositions = Array(starFoodItems.length)
    .fill()
    .map(() => ({
      top: Math.random() * 90 + 5,
      left: Math.random() * 90 + 5,
      size: Math.random() * 30 + 40,
      rotation: Math.random() * 360,
      animationDuration: Math.random() * 20 + 40,
      delay: Math.random() * 10,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));

  // Auto-rotate star food items
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingFoodIndex((prev) => (prev + 1) % starFoodItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [starFoodItems.length]);

  // Page load animation
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  // Filter menu items based on search term, category, and filters
  const getFilteredMenuItems = () => {
    let items = menuItems[activeCategory] || [];

    // Search filter
    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price (budget) filter
    items = items.filter((item) => item.price <= maxBudget);

    // Tags filter
    if (selectedTags.length > 0) {
      items = items.filter((item) =>
        selectedTags.some((tag) => item.tags?.includes(tag))
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
  };

  // Format price
  const formatPrice = (price) => {
    return `KSh ${price}`;
  };

  const filteredItems = getFilteredMenuItems();

  return (
    <div className="mt-20 relative w-full min-h-screen bg-gradient-to-b from-orange-50 to-white overflow-hidden py-8">
      {/* Background - Rotating Star Food Items */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {starPositions.map((pos, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              top: `${pos.top}%`,
              left: `${pos.left}%`,
              transform: `rotate(${pos.rotation}deg)`,
              zIndex: 0,
              opacity: 0.07,
            }}
          >
            <img
              src={starFoodItems[index % starFoodItems.length].image}
              alt="Food background"
              className="object-contain"
              style={{
                width: `${pos.size}px`,
                height: `${pos.size}px`,
                borderRadius: "50%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Pattern Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url(${placeholderImages.food1})`,
          backgroundSize: "100px",
        }}
      />

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
                  Try "Grill"
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
            {menuCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full transition-all ${
                  activeCategory === category
                    ? "bg-red-900 text-white font-medium shadow"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <span>{category}</span>
                {activeCategory === category && (
                  <span className="ml-1">
                    {category === "Grilled Meat"
                      ? "🥩"
                      : category === "Staple Combos"
                      ? "🍚"
                      : category === "Street Food"
                      ? "🌭"
                      : category === "Coastal Dishes"
                      ? "🐟"
                      : category === "Local Drinks"
                      ? "🥤"
                      : category === "Special Fries"
                      ? "🍟"
                      : "🍽️"}
                  </span>
                )}
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
                {menuCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full text-left px-6 py-3 transition-all flex items-center justify-between ${
                      activeCategory === category
                        ? "bg-orange-50 border-l-4 border-red-900 font-medium text-red-900"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span>{category}</span>
                    {activeCategory === category && (
                      <span className="text-lg">
                        {category === "Grilled Meat"
                          ? "🥩"
                          : category === "Staple Combos"
                          ? "🍚"
                          : category === "Street Food"
                          ? "🌭"
                          : category === "Coastal Dishes"
                          ? "🐟"
                          : category === "Local Drinks"
                          ? "🥤"
                          : category === "Special Fries"
                          ? "🍟"
                          : "🍽️"}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Featured Item */}
              <div className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100">
                <div className="text-center">
                  <div className="mb-2 text-sm font-semibold text-orange-600">
                    Today's Special
                  </div>
                  <div className="relative inline-block">
                    <img
                      src={starFoodItems[rotatingFoodIndex].image}
                      alt={starFoodItems[rotatingFoodIndex].name}
                      className="h-24 w-24 object-cover rounded-full mx-auto border-2 border-orange-300"
                    />
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      HOT!
                    </div>
                  </div>
                  <div className="mt-2 font-medium">
                    {starFoodItems[rotatingFoodIndex].name}
                  </div>
                  <div className="text-sm text-gray-600">Today's Special</div>
                </div>
              </div>
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
                  {activeCategory}
                  <span className="ml-2 text-gray-500 text-lg font-normal">
                    ({filteredItems.length} items)
                  </span>
                </h2>

                {/* Custom Message for Category */}
                <div className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-medium">
                  {activeCategory === "Grilled Meat"
                    ? "Hot Grilled Meat!"
                    : activeCategory === "Staple Combos"
                    ? "Fresh Staples!"
                    : activeCategory === "Street Food"
                    ? "Street Flavor!"
                    : activeCategory === "Coastal Dishes"
                    ? "Coastal Special!"
                    : activeCategory === "Local Drinks"
                    ? "Very Cold!"
                    : activeCategory === "Special Fries"
                    ? "Special Fries!"
                    : "Welcome to Menu!"}
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
                    key={index}
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
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                        style={{
                          transform:
                            hoveredItem === index ? "scale(1.1)" : "scale(1)",
                        }}
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>

                      {/* Special Tags */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {item.isNew && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            NEW!
                          </span>
                        )}
                        {item.isPopular && !item.isNew && (
                          <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            POPULAR!
                          </span>
                        )}
                        {item.isHealthy && !item.isNew && !item.isPopular && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            HEALTHY!
                          </span>
                        )}
                      </div>

                      {/* Item price */}
                      <div className="absolute bottom-4 right-4 bg-white/90 text-red-900 font-bold px-3 py-1 rounded-full shadow-lg">
                        {formatPrice(item.price)}
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
                                i < Math.floor(item.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {item.rating}
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
                        {item.tags?.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 rounded-full text-xs ${
                              tag === "Hot Hot"
                                ? "bg-red-100 text-red-600"
                                : tag === "Very Cold"
                                ? "bg-blue-100 text-blue-600"
                                : tag === "Best Seller"
                                ? "bg-yellow-100 text-yellow-700"
                                : tag === "Very Sweet"
                                ? "bg-pink-100 text-pink-600"
                                : tag === "Filling"
                                ? "bg-green-100 text-green-600"
                                : tag === "Affordable"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Order Button */}
                      <div className="flex justify-between items-center">
                        <button className="flex items-center bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-full transition-colors text-sm">
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
    </div>
  );
};

export default Menu;
