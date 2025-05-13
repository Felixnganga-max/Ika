import React, { useState } from "react";
import { PencilIcon, TrashIcon, Loader2 } from "lucide-react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    category: "",
    images: [],
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState("add");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("description", formData.description);
    submitData.append("category", formData.category);
    formData.images.forEach((image) => submitData.append("images", image));

    try {
      if (isEditing) {
        submitData.append("id", formData.id);
        const response = await fetch(
          `http://localhost:4000/api/food/update/${formData.id}`,
          {
            method: "PUT",
            body: submitData,
          }
        );
        if (!response.ok) throw new Error("Failed to update product");

        // Update local state
        const updatedProducts = products.map((product) =>
          product.id === formData.id
            ? { ...formData, images: previewUrls }
            : product
        );
        setProducts(updatedProducts);
      } else {
        const response = await fetch("http://localhost:4000/api/food/add", {
          method: "POST",
          body: submitData,
        });
        if (!response.ok) throw new Error("Failed to add product");

        // Update local state
        const newProduct = { ...formData, id: Date.now(), images: previewUrls };
        setProducts([...products, newProduct]);
      }

      // Reset form
      setFormData({
        id: "",
        name: "",
        price: "",
        description: "",
        category: "",
        images: [],
      });
      setPreviewUrls([]);
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setPreviewUrls(
      Array.isArray(product.images) ? product.images : [product.images]
    );
    setIsEditing(true);
    setViewMode("add");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/food/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");

      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

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
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
              className="p-2 border rounded md:col-span-2"
              rows="3"
              required
            />
            <input
              type="file"
              name="images"
              onChange={handleImageChange}
              className="p-2 border rounded md:col-span-2"
              accept="image/*"
              multiple
              required={!isEditing}
            />

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:col-span-2">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-[#800020] text-white px-4 py-2 rounded hover:bg-[#ffd700] hover:text-[#800020] disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : isEditing ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      )}

      {viewMode === "list" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="p-2 border">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={
                          Array.isArray(product.images)
                            ? product.images[0]
                            : product.images
                        }
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-2 border">{product.name}</td>
                  <td className="p-2 border">${product.price}</td>
                  <td className="p-2 border">{product.description}</td>
                  <td className="p-2 border">{product.category}</td>
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
