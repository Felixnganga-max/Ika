import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Home } from "./pages";
import { Login } from "./components";
import Admin from "./pages/Admin";
import AboutUs from "./pages/AboutUs";
import AddFood from "./components/AddFood";
import Checkout from "./pages/Checkout";
import Menu from "./pages/Menu";
import Navigation from "../src/components/Navigation";
import Footer from "../src/components/Footer";
import ClientOrders from "./pages/Orders";

// Protected Route Component
const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireAdmin = false,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for token in localStorage
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          const user = JSON.parse(userData);

          // Verify token exists and user data is valid
          if (user && (user.id || user._id)) {
            setIsAuthenticated(true);

            // Check if user is admin (adjust this logic based on your user structure)
            if (
              user.role === "admin" ||
              user.isAdmin ||
              user.userType === "admin"
            ) {
              setIsAdmin(true);
            }
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route requires admin privileges and user is not admin
  if (requireAdmin && (!isAuthenticated || !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You don't have permission to access this page. Admin privileges
            required.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-red-900 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If user is authenticated and trying to access login page, redirect to home
  if (
    !requireAuth &&
    isAuthenticated &&
    window.location.pathname === "/login"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Hook to get current user authentication status
export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          const user = JSON.parse(userData);
          if (user && (user.id || user._id)) {
            setAuthState({
              isAuthenticated: true,
              isAdmin:
                user.role === "admin" ||
                user.isAdmin ||
                user.userType === "admin",
              user: user,
              token: token,
            });
          }
        }
      } catch (error) {
        console.error("Error in useAuth:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    checkAuth();

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return authState;
};

const App = () => {
  const location = useLocation();
  const isAdminPage =
    location.pathname === "/admin" || location.pathname === "/add-food";

  return (
    <div className="">
      {!isAdminPage && <Navigation />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/menu" element={<Menu />} />

        {/* Login Route - Redirect to home if already authenticated */}
        <Route
          path="/login"
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute requireAuth={true}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute requireAuth={true}>
              <ClientOrders />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Require Authentication + Admin Privileges */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAuth={true} requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-food"
          element={
            <ProtectedRoute requireAuth={true} requireAdmin={true}>
              <AddFood />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
                <div className="text-gray-400 text-6xl mb-4">404</div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  The page you're looking for doesn't exist.
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-red-900 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          }
        />
      </Routes>
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default App;
