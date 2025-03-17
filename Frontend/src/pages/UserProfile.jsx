import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../api/api";
import Navbar from "../components/Navbar";
import { FaEdit } from "react-icons/fa";

const UserProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    picture: "/user.png",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (user?.id) {
      // console.log("Fetching user profile:", user.id);
      getUserProfile(user.id)
        .then((data) => {
          // console.log("Profile Data Received:", data);
          if (data && data.user) {
            setProfile({
              name: data.user.name || "",
              age: data.user.age || "",
              gender: data.user.gender || "",
              picture: data.user.picture || "/user.png",
            });
          }
        })
        .catch((err) => {
          // console.error("Failed to fetch user profile:", err);
          showMessage("Failed to fetch profile", "error");
        });
    }
  }, [user]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Sending updated data:", profile);
    setLoading(true);

    try {
      const updatedProfile = await updateUserProfile(user.id, profile);
      // console.log("API Response:", updatedProfile);

      if (updatedProfile.success) {
        showMessage("Profile updated successfully!", "success");

        const updatedUserData = { ...user, ...profile };
        login(updatedUserData, localStorage.getItem("token"));
        localStorage.setItem("user", JSON.stringify(updatedUserData));

        setIsEditing(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      // console.error("Profile update failed:", error);
      showMessage("Error updating profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Profile</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 cursor-pointer flex items-center space-x-1"
            >
              <FaEdit className="text-lg" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {message && (
          <div
            className={`mt-4 p-2 text-center text-sm font-semibold rounded ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-500"
                : "bg-red-100 text-red-700 border border-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col items-center mt-4">
          <img
            src={profile.picture || "/user.png"}
            alt="User"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/user.png";
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            ) : (
              <p className="text-gray-700">{profile.name || "N/A"}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Age</label>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            ) : (
              <p className="text-gray-700">{profile.age || "N/A"}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Gender</label>
            {isEditing ? (
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-gray-700">{profile.gender || "N/A"}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default UserProfile;

// Best Version After Medical History Working
