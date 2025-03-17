import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getUserProfile } from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaUserMd,
  FaCalendarCheck,
  FaHistory,
  FaMoneyBillWave,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // console.log("AuthContext User:", user);

  useEffect(() => {
    if (!user || !(user._id || user.id)) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const userId = user._id || user.id;
        // console.log(`Fetching user profile for ID: ${userId}`);

        const profileData = await getUserProfile(userId);
        // console.log("Profile Data:", profileData);

        if (profileData?.user) {
          setProfile(profileData.user);
        } else {
          throw new Error("Invalid profile data received.");
        }
      } catch (err) {
        // console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Loading profile...</p>
    );

  if (error)
    return <p className="text-center text-red-500 font-semibold">{error}</p>;

  return (
    <>
      <Navbar />
      <div
        className="flex flex-col items-center justify-center bg-gray-100 overflow-hidden"
        style={{ minHeight: "calc(100vh - 75px)" }}
      >
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome, {profile?.name || "User"}!
            </h2>
            <p className="text-gray-600 mt-2">
              Explore available services and manage your profile.
            </p>
          </div>

          {/* Services Section */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Link
              to="/doctor-list"
              className="bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center justify-center py-4 rounded-lg shadow transition"
            >
              <FaUserMd className="text-3xl mb-2" />
              <span>Find a Doctor</span>
            </Link>

            <Link
              to="/appointments"
              className="bg-green-500 hover:bg-green-600 text-white flex flex-col items-center justify-center py-4 rounded-lg shadow transition"
            >
              <FaCalendarCheck className="text-3xl mb-2" />
              <span>My Appointments</span>
            </Link>

            <Link
              to="/medical-history"
              className="bg-purple-500 hover:bg-purple-600 text-white flex flex-col items-center justify-center py-4 rounded-lg shadow transition"
            >
              <FaHistory className="text-3xl mb-2" />
              <span>Medical History</span>
            </Link>

            <Link
              to="/payment-history"
              className="bg-orange-500 hover:bg-orange-600 text-white flex flex-col items-center justify-center py-4 rounded-lg shadow transition"
            >
              <FaMoneyBillWave className="text-3xl mb-2" />
              <span>Payments</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

// Best Version After Medical History Working
