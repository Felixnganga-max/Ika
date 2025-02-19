import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: "Place Order", href: "/order" },
    { title: "Our Menu", href: "#menu-section", isScroll: true },
    { title: "About Us", href: "/about-us" },
    { title: "Get In Touch", href: "/contact" },
    { title: "Account", href: "/login" },
  ];

  const menuVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
    },
    closed: {
      opacity: 0,
      y: -10,
    },
  };

  const handleNavigation = (e, item) => {
    if (item.isScroll) {
      e.preventDefault();
      // Close mobile menu if open
      if (isOpen) setIsOpen(false);

      // Find the target element to scroll to
      const targetElement = document.getElementById(item.href.substring(1));

      if (targetElement) {
        // Smooth scroll to the element
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for the fixed navigation
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#800020] shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-shrink-0 cursor-pointer"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <h1 className="text-5xl font-bold text-white">
              Ika <span className="text-[#ffd700]">Fries</span>
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <motion.a
                key={item.title}
                href={item.href}
                className="text-white hover:text-[#ffd700] px-3 py-2 rounded-md md:text-lg text-sm font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleNavigation(e, item)}
              >
                {item.title}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.div className="md:hidden" whileTap={{ scale: 0.9 }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-white hover:text-[#ffd700] focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-50`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <motion.a
              key={item.title}
              href={item.href}
              variants={itemVariants}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#800020] hover:bg-gray-50"
              whileHover={{ x: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleNavigation(e, item)}
            >
              {item.title}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navigation;
