import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages";
import { Login } from "./components";
import Admin from "./pages/Admin";
import AboutUs from "./pages/AboutUs";
import AddFood from "./components/AddFood";
import Checkout from "./pages/Checkout";
import Menu from "./pages/Menu";
import Navigation from "../src/components/Navigation";
import Footer from "../src/components/Footer";

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <div className="">
      {!isAdminPage && <Navigation />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default App;
