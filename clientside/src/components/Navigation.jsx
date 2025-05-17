import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  ShoppingCart,
  Heart,
  Package,
  ChevronDown,
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
      setScrolled(currentScrollPos > 20);
    };

    window.addEventListener("scroll", handleScroll);

    // Fixed the event listener removal
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  const menuItems = [
    { title: "Place Order", href: "#", icon: ShoppingCart },
    { title: "Our Menu", href: "/menu", isScroll: true },
    { title: "About Us", href: "/about-us" },
    { title: "Get In Touch", href: "#" },
    { title: "Dashboard", href: "/admin" },
  ];

  const closeMenus = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#800020]/95 backdrop-blur-sm shadow-lg" : "bg-[#800020]"
      } ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer group"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              closeMenus();
            }}
          >
            <h1
              onClick={() => {
                window.location = "/";
              }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            >
              Ika{" "}
              <span className="text-[#ffd700] inline-block group-hover:scale-105 transition-transform duration-300">
                Fries
              </span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {menuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                onClick={() => {
                  if (item.isScroll) {
                    const element = document.querySelector(item.href);
                    element?.scrollIntoView({ behavior: "smooth" });
                  }
                  closeMenus();
                }}
                className="relative text-white group px-3 py-2 text-lg font-medium transition-colors overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon && <item.icon size={20} />}
                  {item.title}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ffd700] transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}

            {/* Account Section */}
            {isLoggedIn ? (
              <div className="relative dropdown-container">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className="flex items-center gap-2 text-white hover:text-[#ffd700] px-3 py-2 rounded-full transition-colors focus:outline-none"
                >
                  <User size={20} />
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 transform opacity-100 scale-100 transition-all duration-200 origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900">
                        user@example.com
                      </p>
                    </div>

                    <div className="py-1">
                      <a
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={closeMenus}
                      >
                        <User size={16} />
                        Profile
                      </a>
                      <a
                        href="/wishlist"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={closeMenus}
                      >
                        <Heart size={16} />
                        Wishlist
                      </a>
                      <a
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={closeMenus}
                      >
                        <Package size={16} />
                        Orders
                      </a>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="relative overflow-hidden text-white px-6 py-2 rounded-full border-2 border-[#ffd700] hover:bg-[#ffd700] hover:text-[#800020] transition-colors duration-300"
                onClick={closeMenus}
              >
                Sign In
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:text-[#ffd700] focus:outline-none transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                onClick={() => {
                  if (item.isScroll) {
                    const element = document.querySelector(item.href);
                    element?.scrollIntoView({ behavior: "smooth" });
                  }
                  closeMenus();
                }}
                className="flex items-center gap-2 text-white hover:bg-[#ffd700]/10 block px-3 py-2 rounded-lg text-base font-medium transition-colors"
              >
                {item.icon && <item.icon size={20} />}
                {item.title}
              </a>
            ))}

            {!isLoggedIn && (
              <a
                href="/login"
                className="block text-center text-white bg-[#ffd700]/20 hover:bg-[#ffd700]/30 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                onClick={closeMenus}
              >
                Sign In
              </a>
            )}
          </div>

          {isLoggedIn && (
            <div className="px-5 py-3 border-t border-[#ffd700]/20">
              <div className="flex items-center gap-3 px-2 py-2">
                <User size={20} className="text-[#ffd700]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    user@example.com
                  </p>
                  <p className="text-xs text-gray-300">View profile</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 w-full text-center text-red-400 hover:text-red-300 px-3 py-2 rounded-lg text-base font-medium transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
