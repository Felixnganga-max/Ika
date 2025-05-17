import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
  EyeIcon,
  TagIcon,
  SearchIcon,
  BookOpenIcon,
  XIcon,
  SaveIcon,
  PackageIcon,
  ImageIcon,
  TagsIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
  ListIcon,
} from "lucide-react";

// Base API URL
const API_URL = "https://ika-cua5-backend.vercel.app/api/food/";

// Categories for dropdown
const categories = [
  "Breakfast",
  "Snacks",
  "JKA Full Breakfast",
  "JKA Breakfast Combo",
  "Fries",
  "Burgers",
  "Chicken Wings",
  "Rice",
  "Meat",
  "Fish",
  "Kids Menu",
  "Shakes",
];

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    category: "",
    isOnOffer: false,
    offerPrice: "",
    recipe: [],
    images: [],
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({ id: null, recipe: [] });
  const [recipeItem, setRecipeItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedMode = localStorage.getItem("darkMode");
    return savedMode
      ? JSON.parse(savedMode)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      if (response.data.success) {
        // Transform recipe strings to arrays if needed
        const processedProducts = response.data.data.map((product) => {
          // Handle recipe format - if it's a string, try to convert to array
          let recipe = product.recipe || [];

          if (typeof recipe === "string") {
            // Try to parse JSON if it's stored that way
            try {
              recipe = JSON.parse(recipe);
            } catch (e) {
              // If not JSON, split by newlines as fallback
              recipe = recipe.split("\n").filter((item) => item.trim() !== "");
            }
          }

          return {
            ...product,
            recipe: Array.isArray(recipe) ? recipe : [recipe].filter(Boolean),
          };
        });

        setProducts(processedProducts);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      price: "",
      description: "",
      category: "",
      isOnOffer: false,
      offerPrice: "",
      recipe: [],
      images: [],
    });
    setPreviewUrls([]);
    setIsEditing(false);
  };

  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });

    // Create preview URLs for the images
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // Add recipe item to list
  const addRecipeItem = () => {
    if (recipeItem.trim()) {
      setCurrentRecipe({
        ...currentRecipe,
        recipe: [...currentRecipe.recipe, recipeItem.trim()],
      });
      setRecipeItem("");
    }
  };

  // Remove recipe item
  const removeRecipeItem = (index) => {
    const updatedRecipe = [...currentRecipe.recipe];
    updatedRecipe.splice(index, 1);
    setCurrentRecipe({
      ...currentRecipe,
      recipe: updatedRecipe,
    });
  };

  // Form submission for adding or updating products
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare form data for API request
      const productFormData = new FormData();
      productFormData.append("name", formData.name);
      productFormData.append("description", formData.description);
      productFormData.append("price", formData.price);
      productFormData.append("category", formData.category);
      productFormData.append("isOnOffer", formData.isOnOffer);

      if (formData.isOnOffer && formData.offerPrice) {
        productFormData.append("offerPrice", formData.offerPrice);
      }

      if (formData.recipe && formData.recipe.length > 0) {
        // Store recipe as JSON string or appropriate format
        productFormData.append("recipe", JSON.stringify(formData.recipe));
      }

      // Append image files
      if (formData.images.length > 0) {
        formData.images.forEach((file) => {
          productFormData.append("images", file);
        });
      }

      let response;
      if (isEditing) {
        // Update existing product
        response = await axios.put(
          `${API_URL}/${formData.id}`,
          productFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Add new product
        response = await axios.post(API_URL, productFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        // Refresh the product list
        fetchProducts();
        // Reset form and close modal
        resetForm();
        setShowModal(false);
      } else {
        setError(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      setError("Failed to save the product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit product
  const handleEdit = (product) => {
    // Ensure recipe is an array
    const recipeArray = Array.isArray(product.recipe)
      ? product.recipe
      : typeof product.recipe === "string"
      ? product.recipe
        ? [product.recipe]
        : []
      : [];

    setFormData({
      id: product._id, // MongoDB ID
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      isOnOffer: product.isOnOffer,
      offerPrice: product.offerPrice || "",
      recipe: recipeArray,
      images: [], // We can't edit existing images directly
    });

    // Show the existing images
    setPreviewUrls(product.images || []);
    setIsEditing(true);
    setModalType("edit");
    setShowModal(true);
  };

  // Handle view product details
  const handleViewDetails = (product) => {
    // Ensure recipe is an array
    const recipeArray = Array.isArray(product.recipe)
      ? product.recipe
      : typeof product.recipe === "string"
      ? product.recipe
        ? [product.recipe]
        : []
      : [];

    setFormData({
      id: product._id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      isOnOffer: product.isOnOffer,
      offerPrice: product.offerPrice || "",
      recipe: recipeArray,
      images: [],
    });
    setPreviewUrls(product.images || []);
    setModalType("view");
    setShowModal(true);
  };

  // Handle delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(API_URL, { data: { id } });

        if (response.data.success) {
          fetchProducts(); // Refresh the list
        } else {
          setError(response.data.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        setError("Error deleting product");
      }
    }
  };

  // Handle recipe view/edit
  const handleRecipe = (product) => {
    // Ensure recipe is an array
    let recipeArray = [];

    if (Array.isArray(product.recipe)) {
      recipeArray = product.recipe;
    } else if (typeof product.recipe === "string") {
      try {
        // Try to parse JSON
        recipeArray = JSON.parse(product.recipe);
        if (!Array.isArray(recipeArray)) {
          recipeArray = [product.recipe];
        }
      } catch (e) {
        // If not JSON, split by newlines or use as single item
        recipeArray = product.recipe
          ? product.recipe.split("\n").filter((item) => item.trim() !== "")
          : [];
        if (recipeArray.length === 0 && product.recipe) {
          recipeArray = [product.recipe];
        }
      }
    }

    setCurrentRecipe({
      id: product._id,
      recipe: recipeArray,
    });
    setShowRecipeModal(true);
  };

  // Save recipe
  const handleSaveRecipe = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/update-recipe/${currentRecipe.id}`,
        { recipe: JSON.stringify(currentRecipe.recipe) }
      );

      if (response.data.success) {
        fetchProducts(); // Refresh the products
        setShowRecipeModal(false);
      } else {
        setError(response.data.message || "Failed to update recipe");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      setError("Error updating recipe");
    }
  };

  // Toggle offer status
  const handleToggleOffer = async (product) => {
    try {
      const response = await axios.patch(
        `${API_URL}/toggle-offer/${product._id}`
      );

      if (response.data.success) {
        fetchProducts(); // Refresh the products
      } else {
        setError(response.data.message || "Failed to toggle offer status");
      }
    } catch (error) {
      console.error("Error toggling offer status:", error);
      setError("Error updating offer status");
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory
      ? product.category === filterCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Dynamic class for dark/light mode
  const themeClass = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gray-100 text-gray-800";
  const cardClass = darkMode
    ? "bg-gray-800 text-white shadow-dark"
    : "bg-white text-gray-800 shadow-md";
  const inputClass = darkMode
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-gray-300 text-gray-800";
  const buttonPrimary = darkMode
    ? "bg-[#a00030] hover:bg-[#800020] text-white"
    : "bg-[#800020] hover:bg-[#600010] text-white";
  const buttonSecondary = darkMode
    ? "bg-gray-700 hover:bg-gray-600 text-white"
    : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const iconButtonClass = darkMode
    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
    : "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${themeClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0 flex items-center">
            <PackageIcon
              className={`inline-block mr-2 h-8 w-8 ${
                darkMode ? "text-[#a00030]" : "text-[#800020]"
              }`}
            />
            Food Management
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${iconButtonClass}`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => {
                resetForm();
                setModalType("add");
                setShowModal(true);
              }}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${buttonPrimary}`}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className={`border px-4 py-3 rounded mb-6 flex justify-between items-center ${
              darkMode
                ? "bg-red-900 border-red-700 text-red-200"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className={darkMode ? "text-red-200" : "text-red-700"}
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className={`rounded-lg shadow-md p-4 mb-6 ${cardClass}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 p-2 w-full border rounded-lg focus:ring-2 ${
                  darkMode
                    ? "focus:ring-[#a00030] focus:border-[#a00030]"
                    : "focus:ring-[#800020] focus:border-[#800020]"
                } outline-none ${inputClass}`}
              />
            </div>

            <div className="w-full md:w-64">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`p-2 w-full border rounded-lg focus:ring-2 ${
                  darkMode
                    ? "focus:ring-[#a00030] focus:border-[#a00030]"
                    : "focus:ring-[#800020] focus:border-[#800020]"
                } outline-none ${inputClass}`}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                darkMode ? "border-[#a00030]" : "border-[#800020]"
              }`}
            ></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${cardClass}`}
              >
                <div className="relative aspect-video bg-gray-100">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <ImageIcon
                        className={`h-16 w-16 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                  )}
                  {product.isOnOffer && (
                    <div
                      className={`absolute top-0 right-0 ${
                        darkMode
                          ? "bg-yellow-600 text-yellow-100"
                          : "bg-[#ffd700] text-[#800020]"
                      } font-bold py-1 px-3 rounded-bl-lg`}
                    >
                      Sale
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3
                      className={`text-lg font-bold mb-1 ${
                        darkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center">
                      {product.isOnOffer ? (
                        <div className="text-right">
                          <span
                            className={`line-through text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Ksh {product.price}
                          </span>
                          <span
                            className={
                              darkMode
                                ? "text-[#ff6b81] font-bold ml-2"
                                : "text-[#800020] font-bold ml-2"
                            }
                          >
                            Ksh {product.offerPrice}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={
                            darkMode
                              ? "text-[#ff6b81] font-bold"
                              : "text-[#800020] font-bold"
                          }
                        >
                          Ksh {product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-sm mt-1 mb-3 line-clamp-2 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        darkMode
                          ? "bg-gray-700 text-gray-200"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <TagsIcon className="w-3 h-3 mr-1" />
                      {product.category}
                    </span>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleToggleOffer(product)}
                        className={`p-1.5 rounded-full ${
                          product.isOnOffer
                            ? darkMode
                              ? "bg-yellow-800 text-yellow-300"
                              : "bg-yellow-100 text-yellow-600"
                            : iconButtonClass
                        } hover:bg-gray-200`}
                        title={
                          product.isOnOffer
                            ? "Remove from offer"
                            : "Set on offer"
                        }
                      >
                        <TagIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleRecipe(product)}
                        className={`p-1.5 rounded-full ${iconButtonClass}`}
                        title="Recipe"
                      >
                        <BookOpenIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleViewDetails(product)}
                        className={`p-1.5 rounded-full ${iconButtonClass}`}
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEdit(product)}
                        className={`p-1.5 rounded-full ${
                          darkMode
                            ? "bg-gray-700 text-[#ff6b81] hover:bg-gray-600"
                            : "bg-gray-100 text-[#800020] hover:bg-gray-200"
                        }`}
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className={`p-1.5 rounded-full ${
                          darkMode
                            ? "bg-gray-700 text-red-400 hover:bg-gray-600"
                            : "bg-gray-100 text-red-600 hover:bg-gray-200"
                        }`}
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className={`rounded-lg shadow-md p-8 text-center ${cardClass}`}>
            <PackageIcon
              className={`mx-auto h-12 w-12 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              } mb-3`}
            />
            <h3
              className={`text-lg font-medium ${
                darkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              No products found
            </h3>
            <p
              className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div
              className={`rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
            >
              <div
                className={`p-4 border-b flex justify-between items-center ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h2 className="text-xl font-bold">
                  {modalType === "add"
                    ? "Add New Product"
                    : modalType === "edit"
                    ? "Edit Product"
                    : "Product Details"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className={
                    darkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Product Images
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        darkMode ? "border-gray-600" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="file"
                        name="images"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        accept="image/*"
                        multiple
                        disabled={modalType === "view"}
                      />

                      {previewUrls.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {previewUrls.map((url, index) => (
                            <div
                              key={index}
                              className={`relative rounded-lg overflow-hidden aspect-square border ${
                                darkMode ? "border-gray-600" : "border-gray-300"
                              }`}
                            >
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {modalType !== "view" && previewUrls.length < 5 && (
                            <label
                              htmlFor="image-upload"
                              className={`border rounded-lg flex items-center justify-center cursor-pointer aspect-square hover:bg-opacity-80 ${
                                darkMode
                                  ? "border-gray-600 bg-gray-700 hover:bg-gray-600"
                                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                              }`}
                            >
                              <PlusCircleIcon
                                className={`h-8 w-8 ${
                                  darkMode ? "text-gray-400" : "text-gray-400"
                                }`}
                              />
                            </label>
                          )}
                        </div>
                      ) : (
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center h-32 cursor-pointer"
                        >
                          <ImageIcon
                            className={`h-10 w-10 ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            } mb-2`}
                          />
                          <span
                            className={
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            Click to upload images
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`p-2 border rounded-lg w-full focus:ring-2 ${
                        darkMode
                          ? "focus:ring-[#a00030] focus:border-[#a00030]"
                          : "focus:ring-[#800020] focus:border-[#800020]"
                      } outline-none ${inputClass}`}
                      required
                      readOnly={modalType === "view"}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`p-2 border rounded-lg w-full focus:ring-2 ${
                        darkMode
                          ? "focus:ring-[#a00030] focus:border-[#a00030]"
                          : "focus:ring-[#800020] focus:border-[#800020]"
                      } outline-none ${inputClass}`}
                      required
                      disabled={modalType === "view"}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Price (Ksh)
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`p-2 border rounded-lg w-full focus:ring-2 ${
                        darkMode
                          ? "focus:ring-[#a00030] focus:border-[#a00030]"
                          : "focus:ring-[#800020] focus:border-[#800020]"
                      } outline-none ${inputClass}`}
                      step="0.01"
                      min="0"
                      required
                      readOnly={modalType === "view"}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        On Offer
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="isOnOffer"
                          checked={formData.isOnOffer}
                          onChange={handleInputChange}
                          className="sr-only peer"
                          disabled={modalType === "view"}
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer ${
                            darkMode ? "bg-gray-600" : "bg-gray-200"
                          } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:${
                            darkMode ? "bg-[#a00030]" : "bg-[#800020]"
                          }`}
                        ></div>
                      </label>
                    </div>
                  </div>

                  {formData.isOnOffer && (
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Offer Price (Ksh)
                      </label>
                      <input
                        type="number"
                        name="offerPrice"
                        placeholder="0.00"
                        value={formData.offerPrice}
                        onChange={handleInputChange}
                        className={`p-2 border rounded-lg w-full focus:ring-2 ${
                          darkMode
                            ? "focus:ring-[#a00030] focus:border-[#a00030]"
                            : "focus:ring-[#800020] focus:border-[#800020]"
                        } outline-none ${inputClass}`}
                        step="0.01"
                        min="0"
                        required={formData.isOnOffer}
                        readOnly={modalType === "view"}
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Enter product description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`p-2 border rounded-lg w-full focus:ring-2 ${
                        darkMode
                          ? "focus:ring-[#a00030] focus:border-[#a00030]"
                          : "focus:ring-[#800020] focus:border-[#800020]"
                      } outline-none ${inputClass} h-24`}
                      required
                      readOnly={modalType === "view"}
                    ></textarea>
                  </div>
                </div>

                {modalType !== "view" && (
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className={`px-4 py-2 border rounded-lg ${buttonSecondary}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg flex items-center ${buttonPrimary}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></span>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <SaveIcon className="h-4 w-4 mr-2" />
                          {isEditing ? "Update Product" : "Save Product"}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {modalType === "view" && (
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className={`px-4 py-2 rounded-lg ${buttonSecondary}`}
                    >
                      Close
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Recipe Modal */}
        {showRecipeModal && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div
              className={`rounded-lg shadow-xl w-full max-w-2xl ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
            >
              <div
                className={`p-4 border-b flex justify-between items-center ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h2 className="text-xl font-bold flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2" />
                  Recipe Instructions
                </h2>
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className={
                    darkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Recipe Items List */}
                <div
                  className={`border rounded-lg p-4 mb-4 min-h-[200px] ${
                    darkMode
                      ? "border-gray-700 bg-gray-700 bg-opacity-30"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {currentRecipe.recipe && currentRecipe.recipe.length > 0 ? (
                    <ul className="space-y-2">
                      {currentRecipe.recipe.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-start">
                            <span
                              className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs mr-2 mt-0.5 ${
                                darkMode
                                  ? "bg-[#a00030] text-white"
                                  : "bg-[#800020] text-white"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span
                              className={
                                darkMode ? "text-gray-200" : "text-gray-800"
                              }
                            >
                              {item}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeRecipeItem(index)}
                            className={
                              darkMode
                                ? "text-gray-400 hover:text-red-400"
                                : "text-gray-500 hover:text-red-500"
                            }
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8">
                      <ListIcon
                        className={`h-12 w-12 ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        } mb-2`}
                      />
                      <p
                        className={darkMode ? "text-gray-400" : "text-gray-500"}
                      >
                        No recipe instructions added yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Add Recipe Item */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={recipeItem}
                    onChange={(e) => setRecipeItem(e.target.value)}
                    placeholder="Add a new instruction step..."
                    className={`p-2 border rounded-lg flex-1 focus:ring-2 ${
                      darkMode
                        ? "focus:ring-[#a00030] focus:border-[#a00030]"
                        : "focus:ring-[#800020] focus:border-[#800020]"
                    } outline-none ${inputClass}`}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRecipeItem();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addRecipeItem}
                    className={`px-4 py-2 rounded-lg ${buttonPrimary}`}
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowRecipeModal(false)}
                    className={`px-4 py-2 border rounded-lg ${buttonSecondary}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRecipe}
                    className={`px-4 py-2 rounded-lg flex items-center ${buttonPrimary}`}
                  >
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save Recipe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
