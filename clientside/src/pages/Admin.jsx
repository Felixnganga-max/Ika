import React, { useState, useEffect } from "react";
import {
  Clock,
  Bell,
  Settings,
  LogOut,
  User,
  Grid,
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  Bike,
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  X,
  ChevronDown,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductManagement from "../components/ProductManagement";
import { SettingsComponent } from "../components/SettingsComponent";
import { BikerManagement } from "../components/BikerManagement";
import { Dashboard } from "../components/Dashboard";
import CustomerOrders from "../components/CustomerOrders";

// Modal Component for Add/Edit Biker - removed email and status fields
const BikerFormModal = ({ biker, onClose, onSave }) => {
  const [bikerData, setBikerData] = useState(
    biker || {
      name: "",
      phone: "",
      joinDate: new Date().toISOString().split("T")[0],
      rides: 0,
      earnings: "Ksh. 0",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBikerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(bikerData);
    onClose();
  };

  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {biker ? "Edit Biker" : "Add New Biker"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={bikerData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={bikerData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Join Date
              </label>
              <input
                type="date"
                name="joinDate"
                value={bikerData.joinDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#800020] text-white rounded-md hover:bg-[#700010]"
            >
              {biker ? "Update Biker" : "Add Biker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Component for Activities
const ActivitiesModal = ({ onClose, activities }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredActivities, setFilteredActivities] = useState(activities);

  // Filter activities based on search term and date
  useEffect(() => {
    let results = activities;

    if (searchTerm) {
      results = results.filter(
        (activity) =>
          activity.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          activity.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      results = results.filter((activity) => activity.date === selectedDate);
    }

    setFilteredActivities(results);
  }, [searchTerm, selectedDate, activities]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Recent Activities</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="sm:w-64 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {(searchTerm || selectedDate) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDate("");
              }}
              className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 flex items-center"
            >
              <X size={16} className="mr-1" /> Clear
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-grow">
          <div className="space-y-4">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "biker"
                          ? "bg-purple-100"
                          : "bg-green-100"
                      }`}
                    >
                      {activity.type === "biker" ? (
                        <User size={16} className="text-purple-600" />
                      ) : (
                        <Bike size={16} className="text-green-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <span className="font-medium">{activity.action}</span>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">
                      {activity.time}
                    </span>
                    <p className="text-xs text-gray-400">{activity.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No activities match your search criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// REMOVED THE STANDALONE JSX COMPONENTS THAT WERE CAUSING THE ERROR
// These components are imported and used in renderActiveComponent

// Sales Management component - made full width
const Sales = () => (
  <div className="p-6 w-full">
    <h2 className="text-2xl font-bold mb-6">Sales Management</h2>
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <p>Sales management content goes here</p>
    </div>
  </div>
);

const Admin = () => {
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get current date in a nice format
  const getCurrentDate = () => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };

  // State for active tab with persistence
  const [activeTab, setActiveTab] = useState(() => {
    // Get from localStorage or default to "dashboard"
    const saved = localStorage.getItem("adminActiveTab");
    return saved || "dashboard";
  });

  // State for current time
  const [currentTime, setCurrentTime] = useState(formatTime());

  // Update time every minute
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(formatTime());
    }, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(timeInterval);
  }, []);

  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Render the active component based on tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return (
          <div className="w-full">
            <ProductManagement />
          </div>
        );
      case "sales":
        return <Sales />;
      case "bikers":
        return <BikerManagement />;
      case "orders":
        return <CustomerOrders />;
      case "settings":
        return <SettingsComponent />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-[#800020] text-white w-64 fixed h-full z-20 transition-transform ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[#a05070]">
          <h1 className="text-2xl font-bold">IkaFries</h1>
          <p className="text-sm opacity-75">Admin Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex w-full items-center p-2 rounded-lg ${
                  activeTab === "dashboard"
                    ? "bg-white bg-opacity-20"
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <Grid size={20} className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("products")}
                className={`flex w-full items-center p-2 rounded-lg ${
                  activeTab === "products"
                    ? "bg-white bg-opacity-20"
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <Package size={20} className="mr-3" />
                Food Management
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("sales")}
                className={`flex w-full items-center p-2 rounded-lg ${
                  activeTab === "sales"
                    ? "bg-white bg-opacity-20"
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <DollarSign size={20} className="mr-3" />
                Sales Management
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("bikers")}
                className={`flex w-full items-center p-2 rounded-lg ${
                  activeTab === "bikers"
                    ? "bg-white bg-opacity-20"
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <Bike size={20} className="mr-3" />
                Bikers
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex w-full items-center p-2 rounded-lg ${
                  activeTab === "orders"
                    ? "bg-white bg-opacity-20"
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <ShoppingCart size={20} className="mr-3" />
                Orders Management
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex w-full items-center p-2 rounded-lg ${
                  activeTab === "settings"
                    ? "bg-white bg-opacity-20"
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <Settings size={20} className="mr-3" />
                Settings
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-[#a05070]">
          <button
            className="flex w-full items-center p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
            onClick={() => (window.location.href = "/")}
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="block md:hidden text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            {/* Greeting & Date */}
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold">{getGreeting()}, Admin</h2>
              <p className="text-sm text-gray-500">{getCurrentDate()}</p>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Time */}
              <div className="hidden md:flex items-center text-gray-700">
                <Clock size={16} className="mr-1" />
                <span>{currentTime}</span>
              </div>

              {/* Notifications */}
              <button className="relative p-1 rounded-full text-gray-700 hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-[#800020] flex items-center justify-center text-white text-sm font-medium">
                    A
                  </div>
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 w-full h-full">
            {" "}
            {/* Changed to h-full */}
            {renderActiveComponent()}
          </div>
        </main>{" "}
      </div>
    </div>
  );
};

export default Admin;
