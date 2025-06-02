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
  Download,
  ExternalLink,
  ChefHat,
  UtensilsCrossed,
  Pizza,
  Heart,
  Flame,
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
  const [showReceipt, setShowReceipt] = useState(null);

  // Enhanced status configuration with food-themed styling
  const statusConfig = {
    "Food Processing": {
      icon: <ChefHat size={20} className="text-orange-500 animate-bounce" />,
      color: "orange",
      bgColor:
        "bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-white shadow-lg shadow-orange-500/30",
      message: "👨‍🍳 Our chef is crafting your delicious meal with love!",
      estimatedTime: "15-20 minutes",
      pulse: true,
    },
    "On the Way": {
      icon: <Truck size={20} className="text-blue-500 animate-pulse" />,
      color: "blue",
      bgColor:
        "bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 text-white shadow-lg shadow-blue-500/30",
      message: "🚚 Your feast is racing to your doorstep!",
      estimatedTime: "10-15 minutes",
      pulse: true,
    },
    Delivered: {
      icon: <CheckCircle size={20} className="text-green-500" />,
      color: "green",
      bgColor:
        "bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-white shadow-lg shadow-green-500/30",
      message: "🎉 Bon appétit! Your order has arrived!",
      estimatedTime: "Enjoy your meal!",
      pulse: false,
    },
    Cancelled: {
      icon: <AlertCircle size={20} className="text-red-500" />,
      color: "red",
      bgColor:
        "bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 text-white shadow-lg shadow-red-500/30",
      message: "😔 Order cancelled - We'll make it right next time!",
      estimatedTime: "Refund in progress",
      pulse: false,
    },
  };

  // Fixed fetchOrders function
  // Fixed fetchOrders function
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const response = await fetch(`https://ika-cua5-backend.vercel.app/api/order/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // or just token depending on your backend
          // Alternative format if your backend expects just the token:
          // 'token': token,
        },
      });

      const data = await response.json();

      if (data.success) {
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

  // Get user ID from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");

      if (userData) {
        const user = JSON.parse(userData);

        if (user && user.id) {
          setCurrentUserId(user.id);
          console.log("👤 Current user ID:", user.id);
        } else {
          setError("User ID not found in stored data");
          console.error("❌ Invalid user data structure:", user);
        }
      } else {
        setError("Please log in to view your orders");
        console.error("❌ No user data found in localStorage");
      }
    } catch (error) {
      console.error("❌ Error parsing user data from localStorage:", error);
      setError("Error loading user data. Please log in again.");
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

  // Receipt Component
  const ReceiptModal = ({ order, onClose }) => {
    const handleDownloadPDF = () => {
      // In a real app, you'd generate and download PDF here
      alert("PDF download functionality would be integrated here!");
    };

    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Receipt Header */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-6 rounded-t-2xl">
            <div className="text-center">
              <ChefHat size={32} className="mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Yummy Kitchen</h2>
              <p className="text-orange-100">Order Receipt</p>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="p-6 space-y-4">
            <div className="text-center border-b pb-4">
              <h3 className="text-lg font-bold">
                Order #{order._id.slice(-8)}
              </h3>
              <p className="text-gray-500 text-sm">{formatDate(order.date)}</p>
            </div>

            {/* Customer Info */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                Customer:
              </h4>
              <p className="text-sm">{order.address?.contactName || "N/A"}</p>
              <p className="text-sm text-gray-500">{order.address?.email}</p>
              <p className="text-sm text-gray-500">{order.address?.phone}</p>
            </div>

            {/* Delivery Address */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                Delivery Address:
              </h4>
              <p className="text-sm">
                {order.address?.street}
                <br />
                {order.address?.city}, {order.address?.state}{" "}
                {order.address?.zipcode}
                <br />
                {order.address?.country}
              </p>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                Items:
              </h4>
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <p className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">${order.amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Payment Status:</span>
                <span
                  className={order.payment ? "text-green-600" : "text-red-600"}
                >
                  {order.payment ? "✅ Paid" : "⏳ Pending"}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                {statusConfig[order.status]?.icon}
                <span className="font-semibold">{order.status}</span>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                {statusConfig[order.status]?.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Loading state
  if (loading) {
    return (
      <div
        className={`flex justify-center items-center h-screen ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 via-orange-900/20 to-red-900/20"
            : "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50"
        }`}
      >
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>
            <ChefHat className="absolute inset-0 m-auto h-8 w-8 text-orange-500 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-orange-600 mb-2">
            Yummy Kitchen
          </h3>
          <p
            className={`text-lg font-medium ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Fetching your delicious orders...
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <Pizza className="w-6 h-6 text-orange-500 animate-bounce" />
            <Coffee
              className="w-6 h-6 text-orange-500 animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <UtensilsCrossed
              className="w-6 h-6 text-orange-500 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
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
            ? "bg-gradient-to-br from-gray-900 via-red-900/20 to-pink-900/20"
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
            Oops! Kitchen's having trouble
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
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
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
      className={`transition-all mt-20 duration-300 min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-orange-900/10 to-red-900/10 text-gray-100"
          : "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 text-gray-800"
      }`}
    >
      {/* Floating Food Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Pizza className="absolute top-20 left-10 w-8 h-8 text-orange-300/20 animate-float" />
        <Coffee className="absolute top-40 right-20 w-6 h-6 text-orange-300/20 animate-bounce" />
        <UtensilsCrossed className="absolute bottom-40 left-20 w-7 h-7 text-orange-300/20 animate-pulse" />
        <ChefHat className="absolute bottom-20 right-10 w-9 h-9 text-orange-300/20 animate-float" />
      </div>

      {/* Enhanced Header */}
      <header
        className={`relative p-6 backdrop-blur-md border-b ${
          darkMode
            ? "bg-gradient-to-r from-gray-800/90 via-orange-900/20 to-red-900/20 border-gray-700"
            : "bg-gradient-to-r from-white/90 via-orange-100/50 to-red-100/50 border-orange-200"
        } shadow-2xl`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <ChefHat size={32} className="text-white" />
              </div>
              <Flame
                size={16}
                className="absolute -top-1 -right-1 text-yellow-400 animate-pulse"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                Yummy Kitchen
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 flex items-center">
                <Heart size={16} className="mr-2 text-red-500 animate-pulse" />
                Your Order Journey
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/menu"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <UtensilsCrossed size={20} />
              <span>Order More</span>
              <ExternalLink size={16} />
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                darkMode
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-300 hover:to-orange-400"
                  : "bg-gradient-to-r from-gray-700 to-gray-900 text-yellow-300 hover:from-gray-600 hover:to-gray-800"
              } shadow-lg`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div
            className={`p-6 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 via-orange-900/20 to-red-900/20"
                : "bg-gradient-to-br from-white via-orange-50 to-red-50"
            } border-2 ${
              darkMode ? "border-orange-600/30" : "border-orange-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total Orders
              </span>
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
                <Receipt size={20} className="text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {stats.total}
            </p>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 via-orange-900/20 to-yellow-900/20"
                : "bg-gradient-to-br from-white via-orange-50 to-yellow-50"
            } border-2 ${
              darkMode ? "border-orange-600/30" : "border-orange-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Cooking & Delivery
              </span>
              <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
                <Flame size={20} className="text-white animate-pulse" />
              </div>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {stats["Food Processing"] + stats["On the Way"]}
            </p>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 via-green-900/20 to-emerald-900/20"
                : "bg-gradient-to-br from-white via-green-50 to-emerald-50"
            } border-2 ${
              darkMode ? "border-green-600/30" : "border-green-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Delivered
              </span>
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl">
                <CheckCircle size={20} className="text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {stats.Delivered}
            </p>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-800 via-green-900/20 to-emerald-900/20"
                : "bg-gradient-to-br from-white via-green-50 to-emerald-50"
            } border-2 ${
              darkMode ? "border-green-600/30" : "border-green-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Money Spent
              </span>
              <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl">
                <DollarSign size={20} className="text-white" />
              </div>
            </div>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              $
              {orders
                .filter((o) => o.status === "Delivered")
                .reduce((sum, order) => sum + order.amount, 0)
                .toFixed(2)}
            </p>
            <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Search & Filter */}
        <div
          className={`mb-8 p-6 rounded-2xl shadow-xl ${
            darkMode
              ? "bg-gradient-to-r from-gray-800/90 via-orange-900/20 to-red-900/20"
              : "bg-gradient-to-r from-white/90 via-orange-50 to-red-50"
          } border-2 ${
            darkMode ? "border-orange-600/30" : "border-orange-200"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400"
              />
              <input
                type="text"
                placeholder="Search for your favorite orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-12 pr-4 py-4 w-full rounded-xl transition-all duration-200 focus:scale-105 ${
                  darkMode
                    ? "bg-gray-700/50 text-gray-100 focus:bg-gray-600/70"
                    : "bg-white/70 text-gray-800 focus:bg-white"
                } border-2 ${
                  darkMode
                    ? "border-orange-600/30 focus:border-orange-500"
                    : "border-orange-300 focus:border-orange-500"
                } focus:outline-none shadow-inner backdrop-blur-sm`}
              />
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative">
                <button
                  onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  className={`flex items-center space-x-2 px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                    darkMode
                      ? "bg-gradient-to-r from-gray-700/70 to-gray-600/70 hover:from-gray-600/80 hover:to-gray-500/80"
                      : "bg-gradient-to-r from-orange-200/70 to-red-200/70 hover:from-orange-300/80 hover:to-red-300/80"
                  } shadow-lg backdrop-blur-sm border-2 ${
                    darkMode ? "border-orange-600/30" : "border-orange-300"
                  }`}
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
                    className={`absolute top-full mt-2 right-0 w-64 rounded-xl shadow-2xl z-20 backdrop-blur-md border-2 ${
                      darkMode
                        ? "bg-gray-800/95 border-orange-600/30"
                        : "bg-white/95 border-orange-300"
                    }`}
                  >
                    <div className="p-4 space-y-3">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500">
                        Filter by Status
                      </h4>
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
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                            statusFilter === status
                              ? darkMode
                                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
                                : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                              : darkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-orange-100/50"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {status !== "all" && statusConfig[status]?.icon}
                            <span className="capitalize">
                              {status === "all" ? "All Orders" : status}
                            </span>
                            {status !== "all" && (
                              <span className="ml-auto text-xs bg-black/20 px-2 py-1 rounded-full">
                                {stats[status]}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={fetchOrders}
                className={`px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                  darkMode
                    ? "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                } text-white shadow-lg`}
              >
                <RefreshCw size={18} className="inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="mb-8">
          <div
            className={`flex flex-wrap gap-2 p-2 rounded-2xl ${
              darkMode
                ? "bg-gradient-to-r from-gray-800/50 via-orange-900/20 to-red-900/20"
                : "bg-gradient-to-r from-white/50 via-orange-100/50 to-red-100/50"
            } backdrop-blur-md border-2 ${
              darkMode ? "border-orange-600/30" : "border-orange-200"
            } shadow-xl`}
          >
            {[
              {
                key: "all",
                label: "All Orders",
                icon: <ClipboardList size={18} />,
              },
              {
                key: "Food Processing",
                label: "Cooking",
                icon: <ChefHat size={18} />,
              },
              {
                key: "On the Way",
                label: "Out for Delivery",
                icon: <Truck size={18} />,
              },
              {
                key: "Delivered",
                label: "Delivered",
                icon: <CheckCircle size={18} />,
              },
              {
                key: "Cancelled",
                label: "Cancelled",
                icon: <AlertCircle size={18} />,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-6 py-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                  activeTab === tab.key
                    ? darkMode
                      ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl shadow-orange-500/30"
                      : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/30"
                    : darkMode
                    ? "hover:bg-gray-700/50 text-gray-300"
                    : "hover:bg-orange-200/50 text-gray-700"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    activeTab === tab.key
                      ? "bg-black/20 text-white"
                      : darkMode
                      ? "bg-gray-600/50 text-gray-300"
                      : "bg-orange-300/50 text-gray-700"
                  }`}
                >
                  {tab.key === "all" ? stats.total : stats[tab.key] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div
              className={`text-center py-16 rounded-2xl ${
                darkMode
                  ? "bg-gradient-to-br from-gray-800/50 via-orange-900/10 to-red-900/10"
                  : "bg-gradient-to-br from-white/50 via-orange-50 to-red-50"
              } border-2 ${
                darkMode ? "border-orange-600/30" : "border-orange-200"
              } shadow-xl backdrop-blur-md`}
            >
              <div className="mb-6">
                <Package
                  size={64}
                  className={`mx-auto ${
                    darkMode ? "text-gray-600" : "text-orange-300"
                  }`}
                />
              </div>
              <h3
                className={`text-2xl font-bold mb-4 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                No orders found
              </h3>
              <p
                className={`mb-8 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Ready to place your first delicious order?"}
              </p>
              <a
                href="/menu"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <UtensilsCrossed size={20} />
                <span>Browse Menu</span>
                <ExternalLink size={16} />
              </a>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                  darkMode
                    ? "bg-gradient-to-br from-gray-800/90 via-orange-900/10 to-red-900/10"
                    : "bg-gradient-to-br from-white/90 via-orange-50/30 to-red-50/30"
                } border-2 ${
                  darkMode ? "border-orange-600/30" : "border-orange-200"
                } backdrop-blur-md overflow-hidden`}
              >
                {/* Order Header */}
                <div
                  className={`p-6 border-b ${
                    darkMode ? "border-gray-700/50" : "border-orange-200/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="relative">
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                              statusConfig[order.status]?.bgColor
                            }`}
                          >
                            {statusConfig[order.status]?.icon}
                          </div>
                          {statusConfig[order.status]?.pulse && (
                            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-ping"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">
                            Order #{order._id.slice(-8)}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(order.date)}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {getRelativeTime(order.date)}
                          </p>
                        </div>
                      </div>

                      {/* Status Message */}
                      <div
                        className={`p-4 rounded-xl mb-4 ${
                          darkMode
                            ? "bg-gradient-to-r from-orange-900/30 to-red-900/30"
                            : "bg-gradient-to-r from-orange-100/50 to-red-100/50"
                        } border ${
                          darkMode
                            ? "border-orange-600/30"
                            : "border-orange-300/50"
                        }`}
                      >
                        <p className="font-medium text-center">
                          {statusConfig[order.status]?.message}
                        </p>
                        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-1">
                          ⏱️ {statusConfig[order.status]?.estimatedTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div
                        className={`px-4 py-2 rounded-xl font-bold text-lg ${
                          statusConfig[order.status]?.bgColor
                        }`}
                      >
                        ${order.amount}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowReceipt(order)}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                            darkMode
                              ? "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"
                              : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                          }`}
                          title="View Receipt"
                        >
                          <Receipt size={18} />
                        </button>
                        <button
                          onClick={() => toggleOrderExpand(order._id)}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                            darkMode
                              ? "bg-orange-600/20 hover:bg-orange-600/30 text-orange-400"
                              : "bg-orange-100 hover:bg-orange-200 text-orange-600"
                          }`}
                        >
                          {expandedOrderId === order._id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag size={16} className="text-orange-500" />
                      <span className="text-sm">
                        {order.items?.length || 0} items
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-blue-500" />
                      <span className="text-sm">
                        {order.address?.contactName || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          order.payment ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm">
                        {order.payment ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrderId === order._id && (
                  <div
                    className={`p-6 ${
                      darkMode
                        ? "bg-gradient-to-r from-gray-900/50 to-gray-800/50"
                        : "bg-gradient-to-r from-orange-50/50 to-red-50/50"
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center space-x-2">
                          <UtensilsCrossed
                            size={18}
                            className="text-orange-500"
                          />
                          <span>Order Items</span>
                        </h4>
                        <div className="space-y-3">
                          {order.items?.map((item, index) => (
                            <div
                              key={index}
                              className={`flex justify-between items-center p-4 rounded-xl ${
                                darkMode
                                  ? "bg-gray-800/50 border border-gray-700/50"
                                  : "bg-white/50 border border-orange-200/50"
                              } backdrop-blur-sm`}
                            >
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  ${item.price} × {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center space-x-2">
                          <MapPin size={18} className="text-blue-500" />
                          <span>Delivery Details</span>
                        </h4>
                        <div
                          className={`p-4 rounded-xl space-y-3 ${
                            darkMode
                              ? "bg-gray-800/50 border border-gray-700/50"
                              : "bg-white/50 border border-orange-200/50"
                          } backdrop-blur-sm`}
                        >
                          <div className="flex items-start space-x-3">
                            <User size={16} className="text-gray-500 mt-1" />
                            <div>
                              <p className="font-medium">
                                {order.address?.contactName || "N/A"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {order.address?.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Phone size={16} className="text-gray-500 mt-1" />
                            <p className="text-sm">{order.address?.phone}</p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <MapPin size={16} className="text-gray-500 mt-1" />
                            <div className="text-sm">
                              <p>{order.address?.street}</p>
                              <p>
                                {order.address?.city}, {order.address?.state}{" "}
                                {order.address?.zipcode}
                              </p>
                              <p>{order.address?.country}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Receipt Modal */}
      {showReceipt && (
        <ReceiptModal
          order={showReceipt}
          onClose={() => setShowReceipt(null)}
        />
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
