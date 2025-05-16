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

export const Dashboard = () => (
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
