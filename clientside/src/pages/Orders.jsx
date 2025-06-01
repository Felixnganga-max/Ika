import {
  Moon,
  Sun,
  ClipboardList,
  Truck,
  CheckCircle,
  Clock,
  User,
  Phone,
  DollarSign,
  Coffee,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  Filter,
  Mail,
  MapPin,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  Package,
  Star,
  Calendar,
  Receipt,
  Sparkles,
  Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";

export default function ClientOrders() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");

  // Enhanced status configuration with better styling
  const statusConfig = {
    "Food Processing": {
      icon: <Clock size={20} className="text-amber-500" />,
      color: "amber",
      bgColor:
        "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 dark:from-amber-900 dark:to-yellow-900 dark:text-amber-200",
      message: "🍳 Your delicious meal is being prepared with care",
      estimatedTime: "15-20 minutes",
      pulse: true,
    },
    "On the Way": {
      icon: <Truck size={20} className="text-blue-500" />,
      color: "blue",
      bgColor:
        "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 dark:from-blue-900 dark:to-cyan-900 dark:text-blue-200",
      message: "🚚 Your order is speeding towards you!",
      estimatedTime: "10-15 minutes",
      pulse: true,
    },
    Delivered: {
      icon: <CheckCircle size={20} className="text-emerald-500" />,
      color: "emerald",
      bgColor:
        "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 dark:from-emerald-900 dark:to-green-900 dark:text-emerald-200",
      message: "✅ Delivered successfully! Enjoy your meal!",
      estimatedTime: "Completed",
      pulse: false,
    },
    Cancelled: {
      icon: <AlertCircle size={20} className="text-red-500" />,
      color: "red",
      bgColor:
        "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 dark:from-red-900 dark:to-pink-900 dark:text-red-200",
      message: "❌ Order cancelled - refund processing",
      estimatedTime: "Cancelled",
      pulse: false,
    },
  };

  // Fixed fetchOrders function
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:4000/api/order/list`);
      const data = await response.json();
      console.log("data is", data);

      // Fixed: Access data properties directly, not response.data
      if (data.success) {
        // Filter orders to show only current user's orders
        const userOrders = data.orders.filter(
          (order) => order.userId === currentUserId
        );
        setOrders(userOrders);
        console.log("✅ User orders fetched:", userOrders.length);
        console.log("🔍 Filtering for user ID:", currentUserId);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setError(error.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // Get user ID from localStorage (simulate since we can't use localStorage in artifacts)
  useEffect(() => {
    // Simulating user data - in real app this would come from localStorage
    const simulatedUser = {
      id: "6839871d46beee3f572e5b08", // Using the ID from your console log
    };

    if (simulatedUser && simulatedUser.id) {
      setCurrentUserId(simulatedUser.id);
      console.log("👤 Current user ID:", simulatedUser.id);
    } else {
      setError("User ID not found");
    }
  }, []);

  // Initial data fetch when user ID is available
  useEffect(() => {
    if (currentUserId) {
      fetchOrders();
    }
  }, [currentUserId]);

  // Re-fetch when search or filter changes
  useEffect(() => {
    if (currentUserId && (searchTerm || statusFilter !== "all")) {
      const debounceTimer = setTimeout(() => {
        fetchOrders();
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, statusFilter, currentUserId]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Filter orders based on active tab and search term
  const filteredOrders = orders.filter((order) => {
    if (activeTab !== "all" && order.status !== activeTab) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const orderId = order._id.slice(-8).toLowerCase();
      const itemsMatch = order.items?.some((item) =>
        item.name.toLowerCase().includes(searchLower)
      );
      const contactMatch = order.address?.contactName
        ?.toLowerCase()
        .includes(searchLower);

      if (!orderId.includes(searchLower) && !itemsMatch && !contactMatch) {
        return false;
      }
    }

    if (statusFilter !== "all" && order.status !== statusFilter) return false;

    return true;
  });

  // Calculate statistics
  const stats = {
    "Food Processing": orders.filter((o) => o.status === "Food Processing")
      .length,
    "On the Way": orders.filter((o) => o.status === "On the Way").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
    total: orders.length,
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  // Enhanced Loading state
  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        }`}
      >
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="animate-spin h-16 w-16 text-blue-500 mx-auto" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          <p
            className={`mt-4 text-lg font-medium ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading your delicious orders...
          </p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Error state
  if (error) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-red-50 via-pink-50 to-rose-50"
        }`}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <AlertCircle
              size={64}
              className="text-red-500 mx-auto animate-pulse"
            />
          </div>
          <h3
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Oops! Something went wrong
          </h3>
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {error}
          </p>
          <button
            onClick={() => {
              setError(null);
              if (currentUserId) {
                fetchOrders();
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RefreshCw size={20} className="inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-300 min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800"
      }`}
    >
      {/* Enhanced Header */}
      <header
        className={`p-4 backdrop-blur-md border-b ${
          darkMode
            ? "bg-gray-800/80 border-gray-700"
            : "bg-white/80 border-gray-200"
        } shadow-xl`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Package size={28} className="text-blue-500" />
              <Zap
                size={12}
                className="absolute -top-1 -right-1 text-yellow-400"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Orders
              </h1>
              <p className="text-sm text-gray-500 flex items-center">
                <Sparkles size={14} className="mr-1" />
                Track your delicious journey
              </p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-200 transform hover:scale-110 ${
              darkMode
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400"
                : "bg-gradient-to-r from-gray-700 to-gray-900 text-yellow-300 hover:from-gray-600 hover:to-gray-800"
            } shadow-lg`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            className={`p-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                : "bg-gradient-to-br from-white to-gray-50"
            } border ${darkMode ? "border-gray-600" : "border-gray-200"}`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">
                Total Orders
              </span>
              <Receipt size={20} className="text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                : "bg-gradient-to-br from-white to-gray-50"
            } border ${darkMode ? "border-gray-600" : "border-gray-200"}`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">
                In Progress
              </span>
              <Clock size={20} className="text-amber-500 animate-pulse" />
            </div>
            <p className="text-3xl font-bold text-amber-600">
              {stats["Food Processing"] + stats["On the Way"]}
            </p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                : "bg-gradient-to-br from-white to-gray-50"
            } border ${darkMode ? "border-gray-600" : "border-gray-200"}`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">
                Delivered
              </span>
              <CheckCircle size={20} className="text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {stats.Delivered}
            </p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-700"
                : "bg-gradient-to-br from-white to-gray-50"
            } border ${darkMode ? "border-gray-600" : "border-gray-200"}`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-500">
                Total Spent
              </span>
              <DollarSign size={20} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              $
              {orders
                .filter((o) => o.status === "Delivered")
                .reduce((sum, order) => sum + order.amount, 0)
                .toFixed(2)}
            </p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Search & Filter */}
        <div
          className={`mb-8 p-6 rounded-xl shadow-lg ${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-700"
              : "bg-gradient-to-r from-white to-gray-50"
          } border ${darkMode ? "border-gray-600" : "border-gray-200"}`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <Search
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search orders by ID, items, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-12 pr-4 py-3 w-full rounded-xl transition-all duration-200 focus:scale-105 ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 focus:bg-gray-600"
                    : "bg-gray-100 text-gray-800 focus:bg-white"
                } border-2 ${
                  darkMode
                    ? "border-gray-600 focus:border-blue-500"
                    : "border-gray-300 focus:border-blue-500"
                } focus:outline-none shadow-inner`}
              />
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative">
                <button
                  onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                    darkMode
                      ? "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                      : "bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400"
                  } shadow-lg`}
                >
                  <Filter size={18} />
                  <span>Filter</span>
                  {filterMenuOpen ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>

                {filterMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl z-10 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    } border backdrop-blur-md`}
                  >
                    <div className="py-2">
                      {[
                        "all",
                        "Food Processing",
                        "On the Way",
                        "Delivered",
                        "Cancelled",
                      ].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setFilterMenuOpen(false);
                          }}
                          className={`block px-4 py-3 text-sm w-full text-left transition-all duration-200 hover:scale-105 ${
                            statusFilter === status
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                              : darkMode
                              ? "text-gray-100 hover:bg-gray-600"
                              : "text-gray-800 hover:bg-gray-100"
                          } first:rounded-t-xl last:rounded-b-xl`}
                        >
                          {status === "all" ? "All Orders" : status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="mb-8">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {[
              "all",
              "Food Processing",
              "On the Way",
              "Delivered",
              "Cancelled",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } shadow-md border ${
                  darkMode ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{tab === "all" ? "All Orders" : tab}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab
                        ? "bg-white/20"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {tab === "all" ? stats.total : stats[tab] || 0}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div
              className={`text-center py-16 ${
                darkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-700"
                  : "bg-gradient-to-br from-white to-gray-50"
              } rounded-xl shadow-lg border ${
                darkMode ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <div className="mb-6">
                <ClipboardList
                  size={64}
                  className="mx-auto text-gray-400 mb-4"
                />
                <Sparkles
                  size={24}
                  className="mx-auto text-yellow-400 animate-pulse"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "No matching orders found"
                  : "No orders yet"}
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters to find what you're looking for."
                  : "Ready to order some delicious food? Start exploring our menu and place your first order!"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] ${
                  darkMode
                    ? "bg-gradient-to-br from-gray-800 to-gray-700"
                    : "bg-gradient-to-br from-white to-gray-50"
                } border ${darkMode ? "border-gray-600" : "border-gray-200"} ${
                  expandedOrderId === order._id
                    ? "ring-2 ring-blue-500 shadow-blue-500/25"
                    : ""
                }`}
              >
                {/* Enhanced Order Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="font-bold text-xl">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <div
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            statusConfig[order.status]?.bgColor ||
                            "bg-gray-100 text-gray-800"
                          } ${
                            statusConfig[order.status]?.pulse
                              ? "animate-pulse"
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {statusConfig[order.status]?.icon}
                            <span>{order.status}</span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Status Message */}
                      <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                          {statusConfig[order.status]?.message}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center">
                          <Clock size={14} className="mr-1" />
                          {statusConfig[order.status]?.estimatedTime}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <Calendar size={16} className="text-gray-400" />
                          <span>{getRelativeTime(order.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <ShoppingBag size={16} className="text-gray-400" />
                          <span>{order.items?.length || 0} items</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <div className="flex items-center space-x-2">
                            <DollarSign size={16} className="text-gray-400" />
                            <span className="font-bold text-lg">
                              ${order.amount}
                            </span>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.payment
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {order.payment ? "✅ Paid" : "⏳ Pending"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleOrderExpand(order._id)}
                      className={`ml-4 p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      } shadow-lg`}
                    >
                      {expandedOrderId === order._id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Enhanced Expanded Content */}
                {expandedOrderId === order._id && (
                  <div
                    className={`border-t px-6 py-6 ${
                      darkMode
                        ? "border-gray-600 bg-gradient-to-r from-gray-800/50 to-gray-700/50"
                        : "border-gray-200 bg-gradient-to-r from-gray-50/50 to-white/50"
                    } backdrop-blur-sm`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Enhanced Delivery Information */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                          <MapPin size={20} />
                          <span>Delivery Details</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                            <User size={16} className="text-gray-400" />
                            <span className="font-medium">
                              {order.address?.contactName || "N/A"}
                            </span>
                          </div>
                          {order.address?.email && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                              <Mail size={16} className="text-gray-400" />
                              <span>{order.address.email}</span>
                            </div>
                          )}
                          {order.address?.phone && (
                            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                              <Phone size={16} className="text-gray-400" />
                              <span>{order.address.phone}</span>
                            </div>
                          )}
                          <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-700/50">
                            <div className="flex items-start space-x-3">
                              <MapPin
                                size={16}
                                className="text-gray-400 mt-1"
                              />
                              <div>
                                <p className="font-medium">
                                  {order.address?.street || "N/A"}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {order.address?.city || "N/A"},{" "}
                                  {order.address?.state || "N/A"}{" "}
                                  {order.address?.zipcode || ""}
                                </p>
                                {order.address?.country && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {order.address.country}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Order Items */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg mb-4 flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <ShoppingBag size={20} />
                          <span>Order Items ({order.items?.length || 0})</span>
                        </h4>
                        <div className="max-h-64 overflow-y-auto space-y-3">
                          {order.items?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 rounded-lg bg-white/70 dark:bg-gray-700/70 shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                                  <Coffee size={24} className="text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {item.name}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-green-600 dark:text-green-400">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  ${item.price} each
                                </p>
                              </div>
                            </div>
                          )) || (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                              <ShoppingBag
                                size={32}
                                className="mx-auto mb-2 opacity-50"
                              />
                              <p>No items found</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Order Summary */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                          <div className="flex items-center space-x-3 mb-2">
                            <Calendar size={20} className="text-blue-500" />
                            <span className="font-semibold text-blue-700 dark:text-blue-300">
                              Order Date
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(order.date)}
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                          <div className="flex items-center space-x-3 mb-2">
                            <DollarSign size={20} className="text-green-500" />
                            <span className="font-semibold text-green-700 dark:text-green-300">
                              Payment Status
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.payment
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {order.payment ? "✅ Paid" : "⏳ Pending"}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                          <div className="flex items-center space-x-3 mb-2">
                            <Receipt size={20} className="text-purple-500" />
                            <span className="font-semibold text-purple-700 dark:text-purple-300">
                              Total Amount
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            ${order.amount}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3 justify-end">
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                        <FileText size={16} />
                        <span>View Receipt</span>
                      </button>

                      {order.status === "Delivered" && (
                        <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                          <Star size={16} />
                          <span>Rate Order</span>
                        </button>
                      )}

                      {(order.status === "Food Processing" ||
                        order.status === "On the Way") && (
                        <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                          <AlertCircle size={16} />
                          <span>Contact Support</span>
                        </button>
                      )}

                      <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                        <RefreshCw size={16} />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
