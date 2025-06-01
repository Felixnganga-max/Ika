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
  const [updating, setUpdating] = useState(null); // Track which order is being updated

  // Status configuration
  const statusConfig = {
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
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await axios.get(
        `http://localhost:4000/api/order/list?${params}`
      );

      if (response.data.success) {
        setOrders(response.data.orders);
        console.log("✅ Orders fetched:", response.data.orders.length);
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

      const response = await axios.post(
        "http://localhost:4000/api/order/status",
        {
          orderId,
          status: newStatus,
        }
      );

      if (response.data.success) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );

        // Show success message
        console.log(`✅ Order ${orderId} updated to ${newStatus}`);
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

  // Toggle order payment status (mock function - you may want to implement this)
  const togglePaymentStatus = async (orderId, currentPaymentStatus) => {
    try {
      setUpdating(orderId);

      // This would need a separate endpoint in your backend
      // For now, we'll just update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, payment: !currentPaymentStatus }
            : order
        )
      );

      console.log(`✅ Payment status toggled for order ${orderId}`);
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
    // Apply dark mode to body
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
    "Food Processing": orders.filter((o) => o.status === "Food Processing")
      .length,
    "On the Way": orders.filter((o) => o.status === "On the Way").length,
    Delivered: orders.filter((o) => o.status === "Delivered").length,
    Cancelled: orders.filter((o) => o.status === "Cancelled").length,
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

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <RefreshCw className="animate-spin h-16 w-16 text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            Error Loading Orders
          </h3>
          <p className="mt-2 text-gray-600">{error}</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                  <span className="text-sm font-medium">{status}</span>
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
              "Food Processing",
              "On the Way",
              "Delivered",
              "Cancelled",
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
                          Order #{order.orderId || order._id}
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
                            {order.address?.firstname} {order.address?.lastname}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone size={16} className="text-gray-400" />
                          <span>{order.address?.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign size={16} className="text-gray-400" />
                          <span className="font-medium">${order.amount}</span>
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
                          <RefreshCw size={16} className="animate-spin" />
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
                      disabled={updating === order._id}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        order.payment
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      <DollarSign size={16} />
                      <span>{order.payment ? "Mark Unpaid" : "Mark Paid"}</span>
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
                            <span>{order.address?.email}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin size={14} className="text-gray-400 mt-1" />
                            <div>
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
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                            <div className="flex justify-between items-center font-bold">
                              <span>Total</span>
                              <span>${order.amount}</span>
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
    </div>
  );
}
