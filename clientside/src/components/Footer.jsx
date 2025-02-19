import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-gradient-to-b from-[#800020]/95 to-[#600018] text-white overflow-hidden">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#FFD700]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold flex items-center">
              <span className="text-[#FFD700] mr-2">Ika</span>FastFoods
            </h2>
            <p className="text-sm text-white/80 max-w-xs">
              Delicious meals made with love, delivered to your doorstep with
              speed and care.
            </p>
            <div className="flex space-x-4 pt-2">
              {/* Social Media Icons */}
              {["facebook", "instagram", "twitter", "tiktok"].map((social) => (
                <motion.a
                  key={social}
                  href={`#${social}`}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors duration-300"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Simple text icons as placeholders */}
                  <span className="text-sm">
                    {social === "facebook" && "fb"}
                    {social === "instagram" && "ig"}
                    {social === "twitter" && "tw"}
                    {social === "tiktok" && "tk"}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold relative">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-[#FFD700]/80 rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              {["Home", "Menu", "About Us", "Locations", "Catering"].map(
                (link) => (
                  <motion.li key={link}>
                    <a
                      href={`#${link.toLowerCase().replace(" ", "-")}`}
                      className="text-white/80 hover:text-[#FFD700] transition-colors duration-200 flex items-center"
                    >
                      <span className="text-xs mr-1">›</span> {link}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold relative">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-[#FFD700]/80 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#FFD700] mr-2 mt-1">📍</span>
                <span className="text-white/80">
                  123 Tasty Street, Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-[#FFD700] mr-2">📞</span>
                <span className="text-white/80">+254 712 345 678</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#FFD700] mr-2">✉️</span>
                <span className="text-white/80">hello@ikafastfoods.com</span>
              </li>
              <li className="flex items-center">
                <span className="text-[#FFD700] mr-2">⏰</span>
                <span className="text-white/80">Open: 8:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold relative">
              Join Our Mailing List
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-[#FFD700]/80 rounded-full"></span>
            </h3>
            <p className="text-sm text-white/80">
              Subscribe to receive special offers and updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#FFD700]/50 backdrop-blur-sm w-full"
              />
              <motion.button
                className="bg-[#FFD700] text-[#800020] font-medium py-2 px-4 rounded-lg hover:bg-[#FFD700]/90 transition-colors duration-200 whitespace-nowrap"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60 text-center md:text-left">
            © {currentYear} IkaFastFoods. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
            <a
              href="#privacy"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#cookie-policy"
              className="hover:text-white transition-colors duration-200"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
