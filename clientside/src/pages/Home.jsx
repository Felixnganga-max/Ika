import React from "react";
import Navigation from "../components/Navigation.jsx";
import Hero from "../components/Hero";
import HomeSlider from "../components/HomeSlider";
import Fruits from "../components/Fruits.jsx";
import Footer from "../components/Footer.jsx";

const Home = () => {
  return (
    <div>
      <Navigation />
      <div>
        <Hero />
        <Fruits />
        <HomeSlider />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
