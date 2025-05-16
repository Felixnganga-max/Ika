import React, { useState } from "react";
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
export const BikerManagement = () => {
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
