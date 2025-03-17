import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white tracking-wide">
          Doctor Scheduling
        </Link>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/dashboard"
            className="text-white hover:text-gray-200 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/appointments"
            className="text-white hover:text-gray-200 transition"
          >
            Appointments
          </Link>
          <Link
            to="/medical-history"
            className="text-white hover:text-gray-200 transition"
          >
            Medical History
          </Link>
          <Link
            to="/doctor-list"
            className="text-white hover:text-gray-200 transition"
          >
            Find a Doctor
          </Link>
          <Link
            to="/payment-history"
            className="text-white hover:text-gray-200 transition"
          >
            Payments
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-blue-600 p-4 space-y-4 text-center shadow-md md:hidden">
            <Link
              to="/dashboard"
              className="block text-white hover:text-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/appointments"
              className="block text-white hover:text-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Appointments
            </Link>
            <Link
              to="/medical-history"
              className="block text-white hover:text-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Medical History
            </Link>
            <Link
              to="/doctor-list"
              className="block text-white hover:text-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Find a Doctor
            </Link>
            <Link
              to="/payment-history"
              className="block text-white hover:text-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Payments
            </Link>
          </div>
        )}

        {/* Profile Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 text-white hover:bg-blue-800 p-2 rounded-lg transition"
            >
              <img
                src={user.picture || "/user.png"}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-white hover:scale-105 transition"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/user.png";
                }}
              />
              <span className="hidden sm:block font-semibold">
                {user.name || "User"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white text-black shadow-lg rounded-lg border border-gray-200 overflow-hidden transition-all">
                <Link
                  to={
                    user.role === "doctor" ? "/doctor-profile" : "/user-profile"
                  }
                  className="flex items-center px-4 py-3 hover:bg-gray-100 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaUserCircle className="mr-2 text-blue-500" />
                  <span>View Profile</span>
                </Link>

                <button
                  className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-100 transition"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
