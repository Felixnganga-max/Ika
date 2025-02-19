import React, { useState } from "react";
import ProductManagement from "../components/ProductManagement";
import Sales from "../components/Sales";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <div className="bg-[#800020] w-64 p-4 text-white">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <ul>
          <li
            className={`p-2 cursor-pointer hover:bg-[#ffd700] hover:text-[#800020] rounded ${
              activeTab === "products" ? "bg-[#ffd700] text-[#800020]" : ""
            }`}
            onClick={() => setActiveTab("products")}
          >
            Product Management
          </li>
          <li
            className={`p-2 cursor-pointer hover:bg-[#ffd700] hover:text-[#800020] rounded ${
              activeTab === "sales" ? "bg-[#ffd700] text-[#800020]" : ""
            }`}
            onClick={() => setActiveTab("sales")}
          >
            Sales Management
          </li>
          <li className="p-2 cursor-pointer hover:bg-[#ffd700] hover:text-[#800020] rounded">
            Users
          </li>
          <li className="p-2 cursor-pointer hover:bg-[#ffd700] hover:text-[#800020] rounded">
            Settings
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "products" && <ProductManagement />}
        {activeTab === "sales" && <Sales />}
      </div>
    </div>
  );
};

export default Admin;
