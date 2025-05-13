import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages";
import { Login } from "./components";
import Admin from "./pages/Admin";
import AboutUs from "./pages/AboutUs";
import AddFood from "./components/AddFood";
import Checkout from "./pages/Checkout";
import Menu from "./pages/Menu";

const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="menu" element={<Menu />} />
      </Routes>
    </div>
  );
};

export default App;
