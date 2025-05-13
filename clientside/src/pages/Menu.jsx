import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Star,
  Filter,
  ChevronDown,
  ThumbsUp,
  PlusCircle,
  Tag,
} from "lucide-react";
import assets from "../assets/assets.js";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [rotatingFoodIndex, setRotatingFoodIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const menuRef = useRef(null);

  // Kenyan Food Categories
  const menuCategories = [
    "All",
    "Nyama Choma",
    "Ugali Combos",
    "Street Food",
    "Coastal Dishes",
    "Local Drinks",
    "IkaFries Specials",
  ];

  // Kenyan Food Tags
  const foodTags = [
    "Baridi Sana", // Very Cold
    "Moto Moto", // Hot Hot
    "Tamu Sana", // Very Sweet
    "Best Seller",
    "Chapisha", // Makes you full
    "Affordable",
  ];

  // Menu items with Kenyan dishes
  const menuItems = {
    All: [],
    "Nyama Choma": [
      {
        name: "Mbuzi Choma Deluxe",
        price: 850,
        image: assets.goatChoma || "/api/placeholder/400/320",
        description:
          "Succulent goat meat marinated with Kenyan spices, slow-roasted over open flames",
        rating: 4.9,
        tags: ["Moto Moto", "Best Seller", "Chapisha"],
        isPopular: true,
      },
      {
        name: "Kuku Choma Combo",
        price: 650,
        image: assets.chickenChoma || "/api/placeholder/400/320",
        description:
          "Grilled chicken with kachumbari, served with ugali or chips",
        rating: 4.7,
        tags: ["Affordable", "Moto Moto"],
        isHealthy: true,
      },
      {
        name: "Nyama Choma Platter",
        price: 1200,
        image: assets.mixedChoma || "/api/placeholder/400/320",
        description:
          "Mix of beef, goat and chicken choma with roasted potatoes and kachumbari",
        rating: 4.8,
        tags: ["Chapisha", "Best Seller"],
        isNew: true,
      },
    ],
    "Ugali Combos": [
      {
        name: "Ugali na Sukuma",
        price: 350,
        image: assets.ugaliSukuma || "/api/placeholder/400/320",
        description: "Fresh sukuma wiki served with hot ugali and nyama stew",
        rating: 4.5,
        tags: ["Affordable", "Chapisha"],
        isHealthy: true,
      },
      {
        name: "Ugali na Samaki",
        price: 650,
        image: assets.ugaliFish || "/api/placeholder/400/320",
        description:
          "Lake Victoria tilapia served with ugali and local vegetables",
        rating: 4.8,
        tags: ["Moto Moto", "Best Seller"],
        isPopular: true,
      },
      {
        name: "Ugali na Nyama",
        price: 550,
        image: assets.ugaliBeef || "/api/placeholder/400/320",
        description:
          "Tender beef stew with perfectly cooked ugali and steamed vegetables",
        rating: 4.6,
        tags: ["Chapisha", "Affordable"],
        isNew: true,
      },
    ],
    "Street Food": [
      {
        name: "Smokie Pasua",
        price: 150,
        image: assets.smokie || "/api/placeholder/400/320",
        description: "Split sausage with kachumbari and special sauce",
        rating: 4.7,
        tags: ["Affordable", "Best Seller"],
        isPopular: true,
      },
      {
        name: "Mutura Special",
        price: 200,
        image: assets.mutura || "/api/placeholder/400/320",
        description:
          "Traditional Kenyan sausage made with meat, blood and spices",
        rating: 4.6,
        tags: ["Moto Moto"],
        isNew: true,
      },
      {
        name: "Mahindi Choma",
        price: 100,
        image: assets.roastedCorn || "/api/placeholder/400/320",
        description: "Roasted maize cobs with lemon-chili salt",
        rating: 4.5,
        tags: ["Affordable", "Moto Moto"],
        isVegetarian: true,
      },
    ],
    "Coastal Dishes": [
      {
        name: "Biriani ya Kuku",
        price: 550,
        image: assets.biriani || "/api/placeholder/400/320",
        description:
          "Spiced rice dish with chicken, potatoes and special coastal spices",
        rating: 4.8,
        tags: ["Moto Moto", "Chapisha"],
        isPopular: true,
      },
      {
        name: "Samaki wa Kupaka",
        price: 750,
        image: assets.coconutFish || "/api/placeholder/400/320",
        description: "Fish in rich coconut sauce with garlic and tamarind",
        rating: 4.9,
        tags: ["Best Seller", "Moto Moto"],
        isNew: true,
      },
      {
        name: "Mahamri na Mbaazi",
        price: 350,
        image: assets.mahamri || "/api/placeholder/400/320",
        description:
          "Sweet fried bread served with pigeon peas in coconut sauce",
        rating: 4.6,
        tags: ["Affordable", "Tamu Sana"],
        isVegetarian: true,
      },
    ],
    "Local Drinks": [
      {
        name: "Tangawizi Ice",
        price: 150,
        image: assets.gingerDrink || "/api/placeholder/400/320",
        description: "Refreshing ginger drink with lime and honey",
        rating: 4.7,
        tags: ["Baridi Sana", "Best Seller"],
        isHealthy: true,
      },
      {
        name: "Passion Dawa",
        price: 200,
        image: assets.passionDrink || "/api/placeholder/400/320",
        description: "Passion fruit cocktail with local honey and lime",
        rating: 4.8,
        tags: ["Baridi Sana", "Tamu Sana"],
        isPopular: true,
      },
      {
        name: "Ukwaju Shake",
        price: 180,
        image: assets.tamarindDrink || "/api/placeholder/400/320",
        description: "Tamarind drink blended with ice and brown sugar",
        rating: 4.6,
        tags: ["Baridi Sana", "Affordable"],
        isNew: true,
      },
    ],
    "IkaFries Specials": [
      {
        name: "IkaFries Supreme",
        price: 450,
        image: assets.supremeFries || "/api/placeholder/400/320",
        description:
          "Our signature fries topped with minced meat, cheese and special sauce",
        rating: 4.9,
        tags: ["Best Seller", "Chapisha"],
        isPopular: true,
      },
      {
        name: "IkaFries Masala",
        price: 350,
        image: assets.masalaFries || "/api/placeholder/400/320",
        description: "Crispy fries tossed in special Kenyan masala spices",
        rating: 4.7,
        tags: ["Moto Moto", "Affordable"],
        isNew: true,
      },
      {
        name: "IkaFries Kachumbari",
        price: 400,
        image: assets.kachumbariChips || "/api/placeholder/400/320",
        description: "Fries topped with fresh kachumbari salad and avocado",
        rating: 4.6,
        tags: ["Affordable", "Moto Moto"],
        isHealthy: true,
      },
    ],
  };

  // Add All category items
  useEffect(() => {
    const allItems = Object.keys(menuItems)
      .filter((category) => category !== "All")
      .flatMap((category) => menuItems[category]);

    menuItems["All"] = allItems;
  }, []);

  // Star food items that rotate in the background
  const starFoodItems = [
    {
      name: "IkaFries Supreme",
      image: assets.supremeFries || "/api/placeholder/400/320",
    },
    {
      name: "Mbuzi Choma",
      image: assets.goatChoma || "/api/placeholder/400/320",
    },
    {
      name: "Biriani ya Kuku",
      image: assets.biriani || "/api/placeholder/400/320",
    },
    {
      name: "Ugali na Samaki",
      image: assets.ugaliFish || "/api/placeholder/400/320",
    },
    {
      name: "Smokie Pasua",
      image: assets.smokie || "/api/placeholder/400/320",
    },
    {
      name: "Passion Dawa",
      image: assets.passionDrink || "/api/placeholder/400/320",
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
    let items = menuItems[activeCategory];

    // Search filter
    if (searchTerm) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
    items = items.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

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
    setPriceRange([0, 3000]);
    setSelectedTags([]);
    setSearchTerm("");
  };

  // Format price
  const formatPrice = (price) => {
    return `KSh ${price}`;
  };

  const filteredItems = getFilteredMenuItems();

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-orange-50 to-white overflow-hidden py-8">
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
              animation: `floatAround ${pos.animationDuration}s linear ${
                pos.delay
              }s infinite ${pos.direction > 0 ? "normal" : "reverse"}`,
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

      {/* IkaFries Pattern Background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url(${
            assets.ikaFriesLogo || "/api/placeholder/100/100"
          })`,
          backgroundSize: "100px",
          animation: "floatBackground 60s linear infinite",
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
                <span className="text-[#800020]">Chakula</span> Menu
                <span className="inline-block ml-2 animate-bounce-slow">
                  🍽️
                </span>
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Taste the authentic flavors of{" "}
                <span className="font-semibold">Kenya</span> with our
                <span className="relative mx-1 font-semibold">
                  mouthwatering dishes
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300 animate-width-expand"></span>
                </span>
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-4 md:mt-0 relative">
              <div className="flex items-center bg-white rounded-full border border-gray-300 px-4 py-2 shadow-sm hover:shadow transition-shadow">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tafuta chakula..." // Search food in Swahili
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
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 pointer-events-none animate-pulse">
                  Try "Choma"
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
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Bei Range (KSh)
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {formatPrice(priceRange[0])}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="50"
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#800020]"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                    />
                    <span className="text-sm text-gray-600">
                      {formatPrice(priceRange[1])}
                    </span>
                  </div>
                </div>

                {/* Food Tags */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Vigezo (Criteria)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {foodTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? "bg-[#800020] text-white"
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
                  className="bg-[#800020] text-white px-4 py-1 rounded-full text-sm hover:bg-red-800 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area with Categories and Menu Items */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Section - Left Side */}
          <div
            className={`lg:col-span-1 transition-all duration-1000 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-4">
              {/* Category Header */}
              <div className="bg-[#800020] text-white py-4 px-6">
                <h2 className="text-xl font-bold flex items-center">
                  <span>Menu Categories</span>
                  <span className="ml-2 animate-pulse">🍴</span>
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
                        ? "bg-orange-50 border-l-4 border-[#800020] font-medium text-[#800020]"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span>{category}</span>
                    {activeCategory === category && (
                      <span className="text-lg">
                        {category === "Nyama Choma"
                          ? "🥩"
                          : category === "Ugali Combos"
                          ? "🍚"
                          : category === "Street Food"
                          ? "🌭"
                          : category === "Coastal Dishes"
                          ? "🐟"
                          : category === "Local Drinks"
                          ? "🥤"
                          : category === "IkaFries Specials"
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
                    Siku Special
                  </div>
                  <div className="relative inline-block">
                    <img
                      src={starFoodItems[rotatingFoodIndex].image}
                      alt={starFoodItems[rotatingFoodIndex].name}
                      className="h-24 w-24 object-cover rounded-full mx-auto border-2 border-orange-300"
                    />
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 animate-pulse">
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
                <div className="bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-medium animate-pulse">
                  {activeCategory === "Nyama Choma"
                    ? "Nyama Moto Moto!"
                    : activeCategory === "Ugali Combos"
                    ? "Ugali Fresh!"
                    : activeCategory === "Street Food"
                    ? "Street Flavor!"
                    : activeCategory === "Coastal Dishes"
                    ? "Pwani Special!"
                    : activeCategory === "Local Drinks"
                    ? "Baridi Sana!"
                    : activeCategory === "IkaFries Specials"
                    ? "IkaFries Zinafura!"
                    : "Karibu Menu!"}
                </div>
              </div>

              {searchTerm && filteredItems.length === 0 && (
                <div className="mt-4 text-center py-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    Hakuna menus for "
                    <span className="font-medium">{searchTerm}</span>"
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-2 text-sm text-[#800020] hover:underline"
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

                      {/* Hot steam effect for hot foods */}
                      {item.tags?.includes("Moto Moto") && (
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                          <div className="steam-container">
                            <div className="steam steam-one"></div>
                            <div className="steam steam-two"></div>
                            <div className="steam steam-three"></div>
                            <div className="steam steam-four"></div>
                          </div>
                        </div>
                      )}

                      {/* Special Tags */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {item.isNew && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            MPYA!
                          </span>
                        )}
                        {item.isPopular && !item.isNew && (
                          <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            MAARUFU!
                          </span>
                        )}
                        {item.isHealthy && !item.isNew && !item.isPopular && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            AFYA!
                          </span>
                        )}
                      </div>

                      {/* Item price */}
                      <div className="absolute bottom-4 right-4 bg-white/90 text-[#800020] font-bold px-3 py-1 rounded-full shadow-lg">
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
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {item.rating}
                        </span>

                        {/* Animated fire icon for highly rated items */}
                        {item.rating >= 4.8 && (
                          <span className="ml-1 inline-block animate-bounce-slow">
                            🔥
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3">
                        {item.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags?.map((tag) => (
                          <span
                            key={tag}
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              tag === "Moto Moto"
                                ? "bg-red-100 text-red-800"
                                : tag === "Baridi Sana"
                                ? "bg-blue-100 text-blue-800"
                                : tag === "Tamu Sana"
                                ? "bg-pink-100 text-pink-800"
                                : tag === "Best Seller"
                                ? "bg-purple-100 text-purple-800"
                                : tag === "Chapisha"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center">
                        <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Like</span>
                        </button>

                        <button className="flex items-center space-x-1 bg-[#800020] text-white px-3 py-1 rounded-full text-sm hover:bg-red-800 transition-colors">
                          <PlusCircle className="w-4 h-4" />
                          <span>Add to Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredItems.length === 0 && (
                <div className="p-10 text-center">
                  <div className="text-5xl mb-4">🍽️</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Hakuna Menu Items
                  </h3>
                  <p className="text-gray-500 mb-4">
                    No items match your current filters. Try adjusting your
                    search or filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-[#800020] text-white px-4 py-2 rounded-full hover:bg-red-800 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Bottom Spacer */}
              <div className="h-8"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`mt-12 text-center text-gray-600 transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <p className="mb-2">IkaFries Kenya Authentic Menu</p>
          <p className="text-sm">
            © 2025 IkaFries. Proudly Kenyan. All rights reserved.
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes floatAround {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, 15px) rotate(5deg);
          }
          50% {
            transform: translate(0, 30px) rotate(0deg);
          }
          75% {
            transform: translate(-30px, 15px) rotate(-5deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
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
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-width-expand {
          animation: width-expand 2s ease-in-out;
        }

        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Steam effect */
        .steam-container {
          position: relative;
          height: 20px;
        }

        .steam {
          position: absolute;
          height: 20px;
          width: 5px;
          border-radius: 50%;
          background-color: #ffffff;
          opacity: 0;
          filter: blur(5px);
          animation: steam 3s ease-out infinite;
        }

        .steam-one {
          left: -10px;
          animation-delay: 0.5s;
        }

        .steam-two {
          left: 0px;
          animation-delay: 0.7s;
        }

        .steam-three {
          left: 10px;
          animation-delay: 0.9s;
        }

        .steam-four {
          left: 20px;
          animation-delay: 1.1s;
        }

        @keyframes steam {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu;
