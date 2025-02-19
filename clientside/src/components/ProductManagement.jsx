import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    ingredients: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState("add"); // Toggle between 'add' and 'list'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update product
      setProducts(
        products.map((product) =>
          product.id === formData.id ? formData : product
        )
      );
    } else {
      // Add new product
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setFormData({
      id: "",
      name: "",
      price: "",
      description: "",
      ingredients: "",
      image: null,
    });
    setIsEditing(false);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    setViewMode("add");
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {/* Toggle Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setViewMode("add")}
          className={`px-4 py-2 rounded ${
            viewMode === "add"
              ? "bg-[#800020] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Add Product
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 rounded ${
            viewMode === "list"
              ? "bg-[#800020] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          View Products
        </button>
      </div>

      {/* Add Product Form */}
      {viewMode === "add" && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="p-2 border rounded md:col-span-2"
              rows="3"
              required
            />
            <textarea
              name="ingredients"
              placeholder="Ingredients (comma-separated)"
              value={formData.ingredients}
              onChange={handleInputChange}
              className="p-2 border rounded md:col-span-2"
              rows="3"
              required
            />
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="p-2 border rounded md:col-span-2"
              accept="image/*"
              required={!isEditing}
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-[#800020] text-white px-4 py-2 rounded hover:bg-[#ffd700] hover:text-[#800020]"
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}

      {/* Product List */}
      {viewMode === "list" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Ingredients</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="p-2 border">
                    {product.image && (
                      <img
                        src={URL.createObjectURL(product.image)}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">${product.price}</td>
                  <td className="p-2 border">{product.description}</td>
                  <td className="p-2 border">{product.ingredients}</td>
                  <td className="p-2 border">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-[#800020] hover:text-[#ffd700]"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
