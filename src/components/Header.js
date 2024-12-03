import React, { useState, useEffect } from "react";
import { FiLogOut, FiMenu, FiX, FiFileText, FiClipboard } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/digipo1.png"; 
import { logout } from "../authUtils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for menu visibility
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header
      className={`sticky top-0 p-4 flex items-center justify-between shadow-lg z-10 transition-all duration-300 ${
        isScrolled ? "bg-[#0D4F55] bg-opacity-70 backdrop-blur-sm" : "bg-darkBlue"
      }`}
      style={{
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      {/* Logo and Title */}
      <div className="flex items-center space-x-3">
        <img
          src={logo}
          alt="Logo"
          className="w-14 h-14 rounded-full border-2 border-cyberGreen"
        />
        <span
          className={`${
            isScrolled ? "hidden" : "text-cyberGreen"
          } text-2xl font-bold hidden md:inline transition-all duration-300`}
        >
          Cyber Crime Ransomware
        </span>
      </div>

      {/* Menu Button and Dropdown */}
      <div className="flex space-x-4 items-center">
        {/* Hamburger Menu Icon */}
        <button
          onClick={handleMenuToggle}
          className="md:hidden text-cyberGreen text-3xl"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Navigation Links (Desktop & Dropdown for Mobile) */}
        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => navigate("/register-complaint")}
            className="flex items-center space-x-2 text-cyberGreen hover:text-green-400 transition duration-300"
          >
            <FiFileText />
            <span>Report Cyber Attack</span>
          </button>
          <button
            onClick={() => navigate("/view-reports")}
            className="flex items-center space-x-2 text-cyberGreen hover:text-green-400 transition duration-300"
          >
            <FiClipboard />
            <span>View Reports</span>
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 md:hidden space-y-4 w-48"
          >
            <button
              onClick={() => { navigate("/register-complaint"); setMenuOpen(false); }}
              className="flex items-center space-x-2 text-darkBlue hover:text-cyberGreen transition duration-300"
            >
              <FiFileText />
              <span>Report Cyber Attack</span>
            </button>
            <button
              onClick={() => { navigate("/view-reports"); setMenuOpen(false); }}
              className="flex items-center space-x-2 text-darkBlue hover:text-cyberGreen transition duration-300"
            >
              <FiClipboard />
              <span>View Reports</span>
            </button>
          </motion.div>
        )}

        {/* Conditional "Back to Home" Button */}
        {location.pathname !== "/dashboard" && location.pathname !== '/' && (
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden md:flex items-center bg-cyberGreen text-darkBlue px-4 py-2 rounded-full transition duration-300 hover-scale"
          >
            <span className="text-xl">🏠</span>
            <span className="ml-2 hidden md:inline">Back to Home</span>
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className="flex items-center bg-cyberGreen text-darkBlue px-4 py-2 rounded-full transition duration-300 hover-scale"
        >
          <FiLogOut className="text-xl" />
          <span className="ml-2 hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
