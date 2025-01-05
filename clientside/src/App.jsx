import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages";
import { Login } from "./components";

const App = () => {
  return (
    <div className="w-screen min-h-screen h-auto flex flex-col items-center justify-center">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
