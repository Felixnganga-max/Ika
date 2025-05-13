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

// Mock data for bikers - removed email and updated earnings to Ksh.
const initialBikers = [
  {
    id: 1,
    name: "James Wilson",
    phone: "(555) 123-4567",
    joinDate: "2025-01-15",
    rides: 245,
    earnings: "Ksh. 345,000",
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    phone: "(555) 987-6543",
    joinDate: "2024-11-20",
    rides: 187,
    earnings: "Ksh. 278,000",
  },
  {
    id: 3,
    name: "David Chen",
    phone: "(555) 456-7890",
    joinDate: "2025-02-03",
    rides: 103,
    earnings: "Ksh. 156,000",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    phone: "(555) 789-0123",
    joinDate: "2024-12-05",
    rides: 312,
    earnings: "Ksh. 421,000",
  },
  {
    id: 5,
    name: "Marcus Brown",
    phone: "(555) 234-5678",
    joinDate: "2025-03-10",
    rides: 89,
    earnings: "Ksh. 112,000",
  },
];

// Mock data for recent activity
const initialActivities = [
  {
    id: 1,
    type: "biker",
    action: "New biker registered",
    description: "Sarah Johnson joined the platform",
    time: "2 hours ago",
    date: "2025-05-13",
  },
  {
    id: 2,
    type: "ride",
    action: "Ride completed",
    description: "David Chen completed order #38492",
    time: "3 hours ago",
    date: "2025-05-13",
  },
  {
    id: 3,
    type: "biker",
    action: "Status change",
    description: "Marcus Brown changed status to Inactive",
    time: "5 hours ago",
    date: "2025-05-13",
  },
  {
    id: 4,
    type: "ride",
    action: "New ride assigned",
    description: "Maria Rodriguez assigned to order #38495",
    time: "6 hours ago",
    date: "2025-05-13",
  },
  {
    id: 5,
    type: "biker",
    action: "Profile updated",
    description: "James Wilson updated contact information",
    time: "8 hours ago",
    date: "2025-05-13",
  },
  {
    id: 6,
    type: "ride",
    action: "Ride cancelled",
    description: "Order #38490 was cancelled",
    time: "10 hours ago",
    date: "2025-05-13",
  },
  {
    id: 7,
    type: "biker",
    action: "Payment processed",
    description: "Monthly payment sent to David Chen",
    time: "1 day ago",
    date: "2025-05-12",
  },
  {
    id: 8,
    type: "ride",
    action: "Customer complaint",
    description: "Complaint filed for order #38485",
    time: "1 day ago",
    date: "2025-05-12",
  },
  {
    id: 9,
    type: "biker",
    action: "Status change",
    description: "David Chen changed status to On Leave",
    time: "2 days ago",
    date: "2025-05-11",
  },
  {
    id: 10,
    type: "ride",
    action: "New ride assigned",
    description: "James Wilson assigned to order #38482",
    time: "2 days ago",
    date: "2025-05-11",
  },
];

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

// Biker Management Component - updated to fill the entire width and remove status/email columns
const BikerManagement = () => {
  const [bikers, setBikers] = useState(initialBikers);
  const [activities, setActivities] = useState(initialActivities);
  const [showBikerModal, setShowBikerModal] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [currentBiker, setCurrentBiker] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  // Handle adding new biker
  const handleAddBiker = (bikerData) => {
    const newBiker = {
      ...bikerData,
      id: bikers.length + 1,
    };

    setBikers([...bikers, newBiker]);

    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: "biker",
      action: "New biker registered",
      description: `${newBiker.name} joined the platform`,
      time: "Just now",
      date: new Date().toISOString().split("T")[0],
    };

    setActivities([newActivity, ...activities]);
  };

  // Handle editing biker
  const handleEditBiker = (bikerData) => {
    setBikers(
      bikers.map((biker) => (biker.id === bikerData.id ? bikerData : biker))
    );

    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: "biker",
      action: "Profile updated",
      description: `${bikerData.name}'s information was updated`,
      time: "Just now",
      date: new Date().toISOString().split("T")[0],
    };

    setActivities([newActivity, ...activities]);
  };

  // Handle deleting biker
  const handleDeleteBiker = (bikerId) => {
    const bikerToDelete = bikers.find((biker) => biker.id === bikerId);
    setBikers(bikers.filter((biker) => biker.id !== bikerId));
    setDeleteConfirmation(null);

    // Add to activities
    const newActivity = {
      id: activities.length + 1,
      type: "biker",
      action: "Biker removed",
      description: `${bikerToDelete.name} was removed from the platform`,
      time: "Just now",
      date: new Date().toISOString().split("T")[0],
    };

    setActivities([newActivity, ...activities]);
  };

  // Save biker (either add or edit)
  const saveBiker = (bikerData) => {
    if (currentBiker) {
      handleEditBiker(bikerData);
    } else {
      handleAddBiker(bikerData);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Biker Management</h2>
        <button
          onClick={() => {
            setCurrentBiker(null);
            setShowBikerModal(true);
          }}
          className="flex items-center px-4 py-2 bg-[#800020] text-white rounded-lg hover:bg-[#700010]"
        >
          <Plus size={18} className="mr-2" />
          Add New Biker
        </button>
      </div>

      {/* Bikers Table - removed status and email columns */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6 w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bikers.map((biker) => (
                <tr key={biker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-[#800020] rounded-full p-2 mr-3">
                        <User size={16} className="text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {biker.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {biker.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(biker.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {biker.rides}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {biker.earnings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setCurrentBiker(biker);
                          setShowBikerModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation(biker.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {bikers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No bikers found. Add your first biker to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6 w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Recent Activity</h3>
          <button
            onClick={() => setShowActivitiesModal(true)}
            className="text-[#800020] hover:text-[#700010] text-sm flex items-center"
          >
            View More <ChevronDown size={14} className="ml-1" />
          </button>
        </div>
        <div className="space-y-4">
          {activities.slice(0, 3).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full ${
                    activity.type === "biker" ? "bg-purple-100" : "bg-green-100"
                  }`}
                >
                  {activity.type === "biker" ? (
                    <User
                      size={16}
                      className={
                        activity.type === "biker"
                          ? "text-purple-600"
                          : "text-green-600"
                      }
                    />
                  ) : (
                    <Bike size={16} className="text-green-600" />
                  )}
                </div>
                <span className="ml-3">{activity.description}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Biker Add/Edit Modal */}
      {showBikerModal && (
        <BikerFormModal
          biker={currentBiker}
          onClose={() => {
            setShowBikerModal(false);
            setCurrentBiker(null);
          }}
          onSave={saveBiker}
        />
      )}

      {/* Activities Modal */}
      {showActivitiesModal && (
        <ActivitiesModal
          onClose={() => setShowActivitiesModal(false)}
          activities={activities}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this biker? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBiker(deleteConfirmation)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Dashboard component with updated values for Kenya (Ksh instead of $)
const Dashboard = () => (
  <div className="p-6 w-full">
    <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-4 rounded-lg shadow flex items-center">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <Package className="text-blue-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold">254</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow flex items-center">
        <div className="bg-green-100 p-3 rounded-full mr-4">
          <DollarSign className="text-green-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Revenue</p>
          <p className="text-2xl font-bold">Ksh. 1,248,600</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow flex items-center">
        <div className="bg-purple-100 p-3 rounded-full mr-4">
          <Bike className="text-purple-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Active Bikers</p>
          <p className="text-2xl font-bold">42</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow flex items-center">
        <div className="bg-amber-100 p-3 rounded-full mr-4">
          <ShoppingCart className="text-amber-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm">Pending Deliveries</p>
          <p className="text-2xl font-bold">18</p>
        </div>
      </div>
    </div>

    <div className="mt-8 bg-white rounded-lg shadow p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Recent Activity</h3>
        <button className="text-[#800020] hover:text-[#700010] text-sm flex items-center">
          View More <ChevronDown size={14} className="ml-1" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-full">
              <Bike size={16} className="text-purple-600" />
            </div>
            <span className="ml-3">New biker registered: Sarah Johnson</span>
          </div>
          <span className="text-sm text-gray-500">2 hours ago</span>
        </div>
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full">
              <ShoppingCart size={16} className="text-green-600" />
            </div>
            <span className="ml-3">
              Delivery completed: Order #38492 by David Chen
            </span>
          </div>
          <span className="text-sm text-gray-500">3 hours ago</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-full">
              <User size={16} className="text-purple-600" />
            </div>
            <span className="ml-3">
              Status change: Marcus Brown is now Inactive
            </span>
          </div>
          <span className="text-sm text-gray-500">5 hours ago</span>
        </div>
      </div>
    </div>
  </div>
);

// Sales Management component - made full width
const Sales = () => (
  <div className="p-6 w-full">
    <h2 className="text-2xl font-bold mb-6">Sales Management</h2>
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <p>Sales management content goes here</p>
    </div>
  </div>
);

// Customer Orders component - made full width
const CustomerOrders = () => (
  <div className="p-6 w-full">
    <h2 className="text-2xl font-bold mb-6">Customer Orders</h2>
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <p>Customer orders content goes here</p>
    </div>
  </div>
);

// Settings component - made full width
const SettingsComponent = () => (
  <div className="p-6 w-full">
    <h2 className="text-2xl font-bold mb-6">Settings</h2>
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <p>Settings content goes here</p>
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

  // Format the current time
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
                Products
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
                Sales
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
                Orders
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
