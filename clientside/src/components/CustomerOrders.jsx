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
} from "lucide-react";

export default function CustomerOrders() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Food Processing");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status configuration
  const statusConfig = {
    "Food Processing": {
      icon: <Clock size={20} className="text-yellow-500" />,
      color: "yellow",
      next: "On the Way",
      nextLabel: "Set Out for Delivery",
    },
    "On the Way": {
      icon: <TruckIcon size={20} className="text-purple-500" />,
      color: "purple",
      next: "Delivered",
      nextLabel: "Mark as Delivered",
    },
    Delivered: {
      icon: <CheckCircle size={20} className="text-green-500" />,
      color: "green",
      next: null,
      nextLabel: null,
    },
    Cancelled: {
      icon: <AlertCircle size={20} className="text-red-500" />,
      color: "red",
      next: null,
      nextLabel: null,
    },
  };

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/order/list");

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/order/status",
        {
          orderId,
          status: newStatus,
        }
      );

      if (response.data.success) {
        // Update local state
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert("Failed to update order status: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Apply dark mode to body
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  // Filter orders based on active tab and search term
  const filteredOrders = orders.filter((order) => {
    // Filter by status
    let statusMatch = true;
    if (activeTab !== "all") {
      statusMatch = order.status === activeTab;
    }

    // Apply status filter if it's not 'all'
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }

    // Filter by search term
    const searchMatch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.contactName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return statusMatch && searchMatch;
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
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

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
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-100 text-gray-700"
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
          <div
            className={`p-4 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Food Processing</span>
              <Clock size={20} className="text-yellow-500" />
            </div>
            <p className="text-2xl font-bold mt-2">
              {stats["Food Processing"]}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">On the Way</span>
              <TruckIcon size={20} className="text-purple-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats["On the Way"]}</p>
          </div>
          <div
            className={`p-4 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Delivered</span>
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats["Delivered"]}</p>
          </div>
          <div
            className={`p-4 rounded-lg shadow-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cancelled</span>
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <p className="text-2xl font-bold mt-2">{stats["Cancelled"]}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div
          className={`mb-6 p-4 rounded-lg shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, customer or items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-lg ${
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
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
                    }`}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setStatusFilter("all");
                          setFilterMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          statusFilter === "all"
                            ? "bg-blue-500 text-white"
                            : darkMode
                            ? "text-gray-100 hover:bg-gray-600"
                            : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        All Orders
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("Food Processing");
                          setFilterMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          statusFilter === "Food Processing"
                            ? "bg-blue-500 text-white"
                            : darkMode
                            ? "text-gray-100 hover:bg-gray-600"
                            : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        Food Processing
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("On the Way");
                          setFilterMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          statusFilter === "On the Way"
                            ? "bg-blue-500 text-white"
                            : darkMode
                            ? "text-gray-100 hover:bg-gray-600"
                            : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        On the Way
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("Delivered");
                          setFilterMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          statusFilter === "Delivered"
                            ? "bg-blue-500 text-white"
                            : darkMode
                            ? "text-gray-100 hover:bg-gray-600"
                            : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        Delivered
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter("Cancelled");
                          setFilterMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          statusFilter === "Cancelled"
                            ? "bg-blue-500 text-white"
                            : darkMode
                            ? "text-gray-100 hover:bg-gray-600"
                            : "text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "all"
                ? `border-b-2 border-blue-500 font-medium ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`
                : `${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } hover:text-gray-500`
            }`}
          >
            <ShoppingBag size={18} />
            <span>All Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("Food Processing")}
            className={`px-4 py-2 flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "Food Processing"
                ? `border-b-2 border-yellow-500 font-medium ${
                    darkMode ? "text-yellow-400" : "text-yellow-600"
                  }`
                : `${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } hover:text-gray-500`
            }`}
          >
            <Clock size={18} />
            <span>Food Processing ({stats["Food Processing"]})</span>
          </button>
          <button
            onClick={() => setActiveTab("On the Way")}
            className={`px-4 py-2 flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "On the Way"
                ? `border-b-2 border-purple-500 font-medium ${
                    darkMode ? "text-purple-400" : "text-purple-600"
                  }`
                : `${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } hover:text-gray-500`
            }`}
          >
            <TruckIcon size={18} />
            <span>On the Way ({stats["On the Way"]})</span>
          </button>
          <button
            onClick={() => setActiveTab("Delivered")}
            className={`px-4 py-2 flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "Delivered"
                ? `border-b-2 border-green-500 font-medium ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`
                : `${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } hover:text-gray-500`
            }`}
          >
            <CheckCircle size={18} />
            <span>Delivered ({stats["Delivered"]})</span>
          </button>
          <button
            onClick={() => setActiveTab("Cancelled")}
            className={`px-4 py-2 flex items-center space-x-2 whitespace-nowrap ${
              activeTab === "Cancelled"
                ? `border-b-2 border-red-500 font-medium ${
                    darkMode ? "text-red-400" : "text-red-600"
                  }`
                : `${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } hover:text-gray-500`
            }`}
          >
            <AlertCircle size={18} />
            <span>Cancelled ({stats["Cancelled"]})</span>
          </button>
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-750"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {/* Order Header */}
                <div
                  className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer`}
                  onClick={() => toggleOrderExpand(order._id)}
                >
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    {statusConfig[order.status]?.icon || (
                      <Clock size={20} className="text-gray-500" />
                    )}

                    <div>
                      <h3 className="font-medium">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="flex items-center space-x-2">
                      <User
                        size={16}
                        className={darkMode ? "text-gray-400" : "text-gray-500"}
                      />
                      <span className="text-sm">
                        {order.address.contactName}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 ml-auto sm:ml-0">
                      <DollarSign size={16} className="text-green-500" />
                      <span className="font-medium">
                        KES {order.amount.toFixed(2)}
                      </span>
                    </div>

                    {expandedOrderId === order._id ? (
                      <ChevronUp
                        size={20}
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      />
                    )}
                  </div>
                </div>

                {/* Order Details (Expanded) */}
                {expandedOrderId === order._id && (
                  <div
                    className={`p-4 border-t ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Information */}
                      <div
                        className={`p-4 rounded-lg ${
                          darkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <h4 className="font-medium mb-3">
                          Customer Information
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <User
                              size={16}
                              className={
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }
                            />
                            <span>{order.address.contactName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail
                              size={16}
                              className={
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }
                            />
                            <span>{order.address.email}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin
                              size={16}
                              className={`mt-1 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            />
                            <span>
                              {order.address.street}, {order.address.town}
                            </span>
                          </div>
                          <div className="flex items-start space-x-2 mt-2">
                            <div
                              className={`px-3 py-1 rounded-full ${
                                order.payment
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.payment ? "Paid" : "Payment Pending"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium mb-3">Order Items</h4>
                        <div
                          className={`rounded-lg overflow-hidden ${
                            darkMode ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead
                              className={
                                darkMode ? "bg-gray-800" : "bg-gray-100"
                              }
                            >
                              <tr>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                                >
                                  Item
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider"
                                >
                                  Qty
                                </th>
                                <th
                                  scope="col"
                                  className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider"
                                >
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody
                              className={`divide-y ${
                                darkMode ? "divide-gray-600" : "divide-gray-200"
                              }`}
                            >
                              {order.items.map((item, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 py-2">{item.name}</td>
                                  <td className="px-4 py-2 text-center">
                                    {item.quantity}
                                  </td>
                                  <td className="px-4 py-2 text-right">
                                    KES{" "}
                                    {(item.price * item.quantity).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot
                              className={
                                darkMode ? "bg-gray-800" : "bg-gray-100"
                              }
                            >
                              <tr>
                                <td
                                  colSpan="2"
                                  className="px-4 py-2 text-right font-medium"
                                >
                                  Total
                                </td>
                                <td className="px-4 py-2 text-right font-bold">
                                  KES {order.amount.toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-2 justify-end">
                      <div className="flex gap-2">
                        <button
                          className={`p-2 rounded-full ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          title="Edit order"
                        >
                          <PenLine size={18} className="text-blue-500" />
                        </button>
                        <button
                          className={`p-2 rounded-full ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          title="Cancel order"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                "Are you sure you want to cancel this order?"
                              )
                            ) {
                              updateOrderStatus(order._id, "Cancelled");
                            }
                          }}
                        >
                          <Trash size={18} className="text-red-500" />
                        </button>
                      </div>

                      {order.status === "Food Processing" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order._id, "On the Way");
                          }}
                          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center space-x-2"
                        >
                          <TruckIcon size={18} />
                          <span>Set Out for Delivery</span>
                        </button>
                      )}

                      {order.status === "On the Way" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order._id, "Delivered");
                          }}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2"
                        >
                          <CheckCircle size={18} />
                          <span>Mark as Delivered</span>
                        </button>
                      )}

                      {!order.payment && (
                        <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center space-x-2">
                          <DollarSign size={18} />
                          <span>Mark as Paid</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              className={`p-8 text-center rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <ClipboardList size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {searchTerm
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no orders in this category at the moment."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
