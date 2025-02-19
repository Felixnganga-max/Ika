import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages";
import { Login } from "./components";
import Admin from "./pages/Admin";
import AboutUs from "./pages/AboutUs";

const App = () => {
  return (
    <div className="w-full min-h-screen h-auto flex flex-col items-start justify-center">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </div>
  );
};

export default App;
