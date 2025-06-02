import { useState, useEffect } from "react";
import axios from "axios";
import {
  Moon,
  Sun,
  ClipboardList,
  TruckIcon,
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
  MoreVertical,
  Trash,
  PenLine,
  Mail,
  MapPin,
  ShoppingBag,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Receipt,
  Calendar,
  Hash,
  Loader2,
} from "lucide-react";

export default function CustomerOrders() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Status configuration
  const statusConfig = {
    "Payment Pending": {
      icon: <Clock size={20} className="text-orange-500" />,
      color: "orange",
      bgColor: "bg-orange-100 text-orange-800",
      next: "Food Processing",
      nextLabel: "Start Processing",
      canCancel: true,
    },
    "Food Processing": {
      icon: <Clock size={20} className="text-yellow-500" />,
      color: "yellow",
      bgColor: "bg-yellow-100 text-yellow-800",
      next: "On the Way",
      nextLabel: "Set Out for Delivery",
      canCancel: true,
    },
    "On the Way": {
      icon: <TruckIcon size={20} className="text-purple-500" />,
      color: "purple",
      bgColor: "bg-purple-100 text-purple-800",
      next: "Delivered",
      nextLabel: "Mark as Delivered",
      canCancel: false,
    },
    Delivered: {
      icon: <CheckCircle size={20} className="text-green-500" />,
      color: "green",
      bgColor: "bg-green-100 text-green-800",
      next: null,
      nextLabel: null,
      canCancel: false,
    },
    Cancelled: {
      icon: <AlertCircle size={20} className="text-red-500" />,
      color: "red",
      bgColor: "bg-red-100 text-red-800",
      next: null,
      nextLabel: null,
      canCancel: false,
    },
    "Payment Failed": {
      icon: <AlertCircle size={20} className="text-red-500" />,
      color: "red",
      bgColor: "bg-red-100 text-red-800",
      next: null,
      nextLabel: null,
      canCancel: false,
    },
  };

  // Fetch orders from API
  // Fixed fetchOrders function with axios
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

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await axios.get(
        `https://ika-cua5-backend.vercel.app/api/order/list?${params}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // or just token depending on your backend
            // Alternative format if your backend expects just the token:
            // "token": token,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      setError(error.response?.data?.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      const response = await axios.post(
        "https://ika-cua5-backend.vercel.app/api/order/status",
        {
          // This is the data/body of the request
          orderId,
          status: newStatus,
        },
        {
          // This is the config object with headers
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // or just token depending on your backend
            // Alternative format if your backend expects just the token:
            // "token": token,
          },
        }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert("Failed to update order status: " + response.data.message);
      }
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      alert(
        error.response?.data?.message ||
          "Error updating order status. Please try again."
      );
    } finally {
      setUpdating(null);
    }
  };
  // Toggle payment status (now properly implemented to update backend)
  const togglePaymentStatus = async (orderId, currentPaymentStatus) => {
    try {
      setUpdating(`payment-${orderId}`);

      // Call backend API to update payment status
      const response = await axios.post(
        "https://ika-cua5-backend.vercel.app/api/order/update-payment",
        {
          orderId,
          payment: !currentPaymentStatus,
        }
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, payment: !currentPaymentStatus }
              : order
          )
        );
      } else {
        alert("Failed to update payment status: " + response.data.message);
      }
    } catch (error) {
      console.error("❌ Error updating payment status:", error);
      alert("Error updating payment status. Please try again.");
    } finally {
      setUpdating(null);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Re-fetch when search or filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  // Calculate statistics
  const stats = {
    "Payment Pending": orders.filter((o) => o.status === "Payment Pending")
      .length,
    "Food Processing": orders.filter((o) => o.status === "Food Processing")
      .length,
    "On the Way": orders.filter((o) => o.status === "On the Way").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
    "Payment Failed": orders.filter((o) => o.status === "Payment Failed")
      .length,
    total: orders.length,
  };

  // Toggle expanded order
  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Format date
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

  // Format M-Pesa transaction date
  const formatMpesaDate = (dateString) => {
    if (!dateString) return "N/A";

    // Handle M-Pesa date format (YYYYMMDDHHMMSS)
    if (typeof dateString === "string" && dateString.length === 14) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(8, 10);
      const minute = dateString.substring(10, 12);
      const second = dateString.substring(12, 14);

      const date = new Date(
        `${year}-${month}-${day}T${hour}:${minute}:${second}`
      );
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }

    // Handle regular date format
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RefreshCw className="animate-spin h-16 w-16 text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Error Loading Orders
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transition-all duration-300 min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <header
        className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coffee size={24} className="text-blue-500" />
            <h1 className="text-xl font-bold">Restaurant Order Manager</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {Object.entries(stats)
            .filter(([key]) => key !== "total")
            .map(([status, count]) => (
              <div
                key={status}
                className={`p-4 rounded-lg shadow-md transition-colors ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">{status}</span>
                  {statusConfig[status]?.icon}
                </div>
                <p className="text-2xl font-bold mt-2">{count}</p>
              </div>
            ))}
        </div>

        {/* Search & Filter */}
        <div
          className={`mb-6 p-4 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search orders by ID, customer or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-lg transition-colors ${
                  darkMode
                    ? "bg-gray-700 text-gray-100 focus:bg-gray-600"
                    : "bg-gray-100 text-gray-800 focus:bg-white"
                } border ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative">
                <button
                  onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
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
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${
                      darkMode ? "bg-gray-700" : "bg-white"
                    } border ${
                      darkMode ? "border-gray-600" : "border-gray-200"
                    }`}
                  >
                    <div className="py-1">
                      {[
                        "all",
                        "Payment Pending",
                        "Food Processing",
                        "On the Way",
                        "Delivered",
                        "Cancelled",
                        "Payment Failed",
                      ].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setFilterMenuOpen(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left transition-colors ${
                            statusFilter === status
                              ? "bg-blue-500 text-white"
                              : darkMode
                              ? "text-gray-100 hover:bg-gray-600"
                              : "text-gray-800 hover:bg-gray-100"
                          }`}
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
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
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

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto">
            {[
              "all",
              "Payment Pending",
              "Food Processing",
              "On the Way",
              "Delivered",
              "Cancelled",
              "Payment Failed",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-blue-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } shadow-md`}
              >
                {tab === "all" ? "All Orders" : tab}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-opacity-20 bg-white">
                  {tab === "all" ? stats.total : stats[tab] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div
              className={`text-center py-12 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-md`}
            >
              <ClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                No orders found
              </h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Orders will appear here once they are placed"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`rounded-lg shadow-md transition-all duration-200 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } ${
                  expandedOrderId === order._id ? "ring-2 ring-blue-500" : ""
                }`}
              >
                {/* Order Header */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          Order #{order.orderId || order._id.slice(-8)}
                        </h3>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            statusConfig[order.status]?.bgColor ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div className="flex items-center space-x-1">
                            {statusConfig[order.status]?.icon}
                            <span>{order.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-gray-400" />
                          <span>
                            {order.address?.contactName ||
                              `${order.address?.firstname || ""} ${
                                order.address?.lastname || ""
                              }`.trim() ||
                              "Unknown Customer"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone size={16} className="text-gray-400" />
                          <span>
                            {order.address?.phone ||
                              order.mobileNumber ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign size={16} className="text-gray-400" />
                          <span className="font-medium">
                            KES {order.amount}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              order.payment
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {order.payment ? "Paid" : "Unpaid"}
                          </span>
                        </div>
                      </div>

                      {/* STK Push Message */}
                      {order.stkPushDetails && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-400">
                            <FileText size={16} />
                            <span className="font-medium text-sm">
                              M-Pesa Payment Request
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                            {order.stkPushDetails.CustomerMessage ||
                              "Payment request sent to customer"}
                          </div>
                          <div className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                            Request ID: {order.stkPushDetails.CheckoutRequestID}
                          </div>
                        </div>
                      )}

                      {/* Payment Confirmation Preview */}
                      {order.paymentConfirmation && (
                        <div
                          className={`mt-3 p-3 rounded-lg border ${
                            order.paymentConfirmation.resultCode === 0
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          }`}
                        >
                          <div
                            className={`flex items-center space-x-2 ${
                              order.paymentConfirmation.resultCode === 0
                                ? "text-green-800 dark:text-green-400"
                                : "text-red-800 dark:text-red-400"
                            }`}
                          >
                            <Receipt size={16} />
                            <span className="font-medium text-sm">
                              {order.paymentConfirmation.resultCode === 0
                                ? "M-Pesa Payment Confirmed"
                                : "Payment Failed"}
                            </span>
                          </div>
                          <div
                            className={`mt-1 text-xs ${
                              order.paymentConfirmation.resultCode === 0
                                ? "text-green-700 dark:text-green-300"
                                : "text-red-700 dark:text-red-300"
                            }`}
                          >
                            {order.paymentConfirmation.resultDesc}
                          </div>
                          {order.paymentConfirmation.mpesaReceiptNumber && (
                            <div
                              className={`mt-1 text-xs ${
                                order.paymentConfirmation.resultCode === 0
                                  ? "text-green-700 dark:text-green-300"
                                  : "text-red-700 dark:text-red-300"
                              }`}
                            >
                              Receipt:{" "}
                              {order.paymentConfirmation.mpesaReceiptNumber}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-2 text-sm text-gray-500">
                        <span>{formatDate(order.date)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleOrderExpand(order._id)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                      >
                        {expandedOrderId === order._id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {statusConfig[order.status]?.next && (
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order._id,
                            statusConfig[order.status].next
                          )
                        }
                        disabled={updating === order._id}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {updating === order._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          statusConfig[statusConfig[order.status].next]?.icon
                        )}
                        <span>{statusConfig[order.status].nextLabel}</span>
                      </button>
                    )}

                    {statusConfig[order.status]?.canCancel && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "Cancelled")
                        }
                        disabled={updating === order._id}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <AlertCircle size={16} />
                        <span>Cancel Order</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        togglePaymentStatus(order._id, order.payment)
                      }
                      disabled={updating === `payment-${order._id}`}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        order.payment
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {updating === `payment-${order._id}` ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <DollarSign size={16} />
                      )}
                      <span>
                        {updating === `payment-${order._id}`
                          ? "Updating..."
                          : order.payment
                          ? "Mark Unpaid"
                          : "Mark Paid"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedOrderId === order._id && (
                  <div
                    className={`border-t px-4 py-4 ${
                      darkMode
                        ? "border-gray-700 bg-gray-750"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Customer Information */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <User size={18} />
                          <span>Customer Information</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail size={14} className="text-gray-400" />
                            <span>{order.address?.email || "N/A"}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin size={14} className="text-gray-400 mt-1" />
                            <div>
                              <p>{order.address?.street || "N/A"}</p>
                              <p>
                                {order.address?.city ||
                                  order.address?.town ||
                                  "N/A"}
                                {order.address?.state &&
                                  `, ${order.address.state}`}
                                {order.address?.zipcode &&
                                  ` ${order.address.zipcode}`}
                              </p>
                              <p>{order.address?.country || "Kenya"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <ShoppingBag size={18} />
                          <span>Order Items</span>
                        </h4>
                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <span className="font-medium">
                                KES {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                            <div className="flex justify-between items-center font-bold">
                              <span>Total</span>
                              <span>KES {order.amount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details Section */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-3 flex items-center space-x-2">
                        <CreditCard size={18} />
                        <span>Payment Details</span>
                      </h4>

                      {/* STK Push Details */}
                      {order.stkPushDetails && (
                        <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <h5 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                            M-Pesa Payment Request
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-blue-700 dark:text-blue-300">
                                <span className="font-medium">Status:</span>{" "}
                                {order.stkPushDetails.ResponseDescription}
                              </p>
                              <p className="text-blue-700 dark:text-blue-300">
                                <span className="font-medium">Message:</span>{" "}
                                {order.stkPushDetails.CustomerMessage}
                              </p>
                            </div>
                            <div>
                              <p className="text-blue-700 dark:text-blue-300">
                                <span className="font-medium">
                                  Merchant Request ID:
                                </span>{" "}
                                {order.stkPushDetails.MerchantRequestID}
                              </p>
                              <p className="text-blue-700 dark:text-blue-300">
                                <span className="font-medium">
                                  Checkout Request ID:
                                </span>{" "}
                                {order.stkPushDetails.CheckoutRequestID}
                              </p>
                              <p className="text-blue-700 dark:text-blue-300">
                                <span className="font-medium">Sent At:</span>{" "}
                                {formatDate(order.stkPushDetails.sentAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payment Confirmation Details */}
                      {order.paymentConfirmation && (
                        <div
                          className={`rounded-lg p-4 border ${
                            order.paymentConfirmation.resultCode === 0
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          }`}
                        >
                          <h5
                            className={`font-medium mb-2 ${
                              order.paymentConfirmation.resultCode === 0
                                ? "text-green-800 dark:text-green-400"
                                : "text-red-800 dark:text-red-400"
                            }`}
                          >
                            {order.paymentConfirmation.resultCode === 0
                              ? "Payment Confirmation"
                              : "Payment Failure"}
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p
                                className={
                                  order.paymentConfirmation.resultCode === 0
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-red-700 dark:text-red-300"
                                }
                              >
                                <span className="font-medium">Result:</span>{" "}
                                {order.paymentConfirmation.resultDesc}
                              </p>
                              {order.paymentConfirmation.mpesaReceiptNumber && (
                                <p
                                  className={
                                    order.paymentConfirmation.resultCode === 0
                                      ? "text-green-700 dark:text-green-300"
                                      : "text-red-700 dark:text-red-300"
                                  }
                                >
                                  <span className="font-medium">
                                    Receipt Number:
                                  </span>{" "}
                                  {order.paymentConfirmation.mpesaReceiptNumber}
                                </p>
                              )}
                              {order.paymentConfirmation.amount && (
                                <p
                                  className={
                                    order.paymentConfirmation.resultCode === 0
                                      ? "text-green-700 dark:text-green-300"
                                      : "text-red-700 dark:text-red-300"
                                  }
                                >
                                  <span className="font-medium">Amount:</span>{" "}
                                  KES {order.paymentConfirmation.amount}
                                </p>
                              )}
                            </div>
                            <div>
                              {order.paymentConfirmation.phoneNumber && (
                                <p
                                  className={
                                    order.paymentConfirmation.resultCode === 0
                                      ? "text-green-700 dark:text-green-300"
                                      : "text-red-700 dark:text-red-300"
                                  }
                                >
                                  <span className="font-medium">
                                    Phone Number:
                                  </span>{" "}
                                  {order.paymentConfirmation.phoneNumber}
                                </p>
                              )}
                              {order.paymentConfirmation.transactionDate && (
                                <p
                                  className={
                                    order.paymentConfirmation.resultCode === 0
                                      ? "text-green-700 dark:text-green-300"
                                      : "text-red-700 dark:text-red-300"
                                  }
                                >
                                  <span className="font-medium">
                                    Transaction Date:
                                  </span>{" "}
                                  {formatMpesaDate(
                                    order.paymentConfirmation.transactionDate
                                  )}
                                </p>
                              )}
                              {order.paymentConfirmation.confirmedAt && (
                                <p
                                  className={
                                    order.paymentConfirmation.resultCode === 0
                                      ? "text-green-700 dark:text-green-300"
                                      : "text-red-700 dark:text-red-300"
                                  }
                                >
                                  <span className="font-medium">
                                    Processed At:
                                  </span>{" "}
                                  {formatDate(
                                    order.paymentConfirmation.confirmedAt
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Order Timeline/History */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-3 flex items-center space-x-2">
                        <Clock size={18} />
                        <span>Order Timeline</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-500">
                            Order placed on {formatDate(order.date)}
                          </span>
                        </div>
                        {order.stkPushDetails && (
                          <div className="flex items-center space-x-3 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-500">
                              Payment request sent on{" "}
                              {formatDate(order.stkPushDetails.sentAt)}
                            </span>
                          </div>
                        )}
                        {order.paymentConfirmation && (
                          <div className="flex items-center space-x-3 text-sm">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                order.paymentConfirmation.resultCode === 0
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-gray-500">
                              Payment{" "}
                              {order.paymentConfirmation.resultCode === 0
                                ? "confirmed"
                                : "failed"}{" "}
                              on{" "}
                              {formatDate(
                                order.paymentConfirmation.confirmedAt ||
                                  order.paymentConfirmation.transactionDate
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-3 text-sm">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              order.status === "Delivered"
                                ? "bg-green-500"
                                : order.status === "Cancelled"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          ></div>
                          <span className="text-gray-500">
                            Current status: {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination or Load More (if needed) */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`mt-12 p-6 text-center border-t ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <p className="text-sm text-gray-500">
          © 2024 Restaurant Order Manager. Built with React & Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}
