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

  const isUser = user?.role === "user";
  const isDoctor = user?.role === "doctor";

  return (
    <nav className="bg-gradient-to-r from-slate-700 to-gray-800 py-3 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center min-h-[64px]">
        <Link
          to={isDoctor ? "/doctor-dashboard" : "/dashboard"}
          className="text-2xl font-bold text-gray-100 tracking-wide hover:text-emerald-300 transition"
        >
          DocSchedule
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6">
          <Link
            to={isDoctor ? "/doctor-dashboard" : "/dashboard"}
            className="text-gray-100 hover:text-emerald-300 transition"
          >
            Dashboard
          </Link>

          {isDoctor && (
            <Link
              to="/appointments"
              className="text-gray-100 hover:text-emerald-300 transition"
            >
              Appointments
            </Link>
          )}

          {isUser && (
            <>
              <Link
                to="/medical-history"
                className="text-gray-100 hover:text-emerald-300 transition"
              >
                Medical History
              </Link>
              <Link
                to="/doctor-list"
                className="text-gray-100 hover:text-emerald-300 transition"
              >
                Find a Doctor
              </Link>
              <Link
                to="/payment-history"
                className="text-gray-100 hover:text-emerald-300 transition"
              >
                Payments
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-100 text-2xl focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-gray-800 p-4 space-y-4 text-center shadow-md md:hidden z-50">
            <Link
              to={isDoctor ? "/doctor-dashboard" : "/dashboard"}
              className="block text-gray-100 hover:text-emerald-300"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>

            {isDoctor && (
              <Link
                to="/appointments"
                className="block text-gray-100 hover:text-emerald-300"
                onClick={() => setMenuOpen(false)}
              >
                Appointments
              </Link>
            )}

            {isUser && (
              <>
                <Link
                  to="/medical-history"
                  className="block text-gray-100 hover:text-emerald-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Medical History
                </Link>
                <Link
                  to="/doctor-list"
                  className="block text-gray-100 hover:text-emerald-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Find a Doctor
                </Link>
                <Link
                  to="/payment-history"
                  className="block text-gray-100 hover:text-emerald-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Payments
                </Link>
              </>
            )}
          </div>
        )}

        {/* Profile Dropdown (Doctor/User) */}
        {user && (
          <div className="relative ml-4" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 text-white hover:bg-slate-600 p-2 rounded-lg transition"
            >
              <img
                src={user.picture || "/user.png"}
                alt="User"
                className="w-9 h-9 rounded-full border-2 border-gray-500 hover:scale-105 transition"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/user.png";
                }}
              />
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-sm font-semibold text-gray-100">
                  {user.name}
                </p>
                <p className="text-xs text-gray-300 capitalize mt-0.5">
                  {user.role}
                </p>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white text-black shadow-lg rounded-lg border border-gray-200 overflow-hidden z-50">
                <Link
                  to={isDoctor ? "/doctor-profile" : "/user-profile"}
                  className="flex items-center px-4 py-3 hover:bg-gray-100 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaUserCircle className="mr-2 text-slate-700" />
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
