import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getDoctorProfile, updateDoctorProfile } from "../api/api";
import Navbar from "../components/Navbar";
import { FaEdit } from "react-icons/fa";
import AvailabilityEditor from "../components/AvailabilityEditor";

const DoctorProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    picture: "/user.png",
  });
  const [availability, setAvailability] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (user?.id) {
      getDoctorProfile(user.id)
        .then((data) => {
          if (data && data.doctor) {
            setProfile({
              name: data.doctor.name || "",
              specialization: data.doctor.specialization || "",
              picture: data.doctor.picture || "/user.png",
            });
            setAvailability(data.doctor.availability || []);
          }
        })
        .catch(() => {
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
    setLoading(true);

    try {
      const updatedData = {
        ...profile,
        availability,
      };

      const res = await updateDoctorProfile(user.id, updatedData);

      if (res.success) {
        showMessage("Profile updated successfully!", "success");

        const updatedUser = {
          ...user,
          name: profile.name,
          picture: profile.picture,
          specialization: profile.specialization,
        };

        login(updatedUser, localStorage.getItem("token"));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      showMessage("Error updating profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const extractWeekdays = (availability) => {
    const weekday = availability?.find((a) => a.type === "weekday");
    return weekday?.days?.join(", ") || "N/A";
  };

  const extractTimeSlots = (availability) => {
    const allSlots = availability?.flatMap((a) => a.slots || []);
    return allSlots?.join(", ") || "N/A";
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Doctor Profile</h2>
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
            alt="Doctor"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/user.png";
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {/* Name */}
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

          {/* Specialization */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Specialization</label>
            {isEditing ? (
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            ) : (
              <p className="text-gray-700">{profile.specialization || "N/A"}</p>
            )}
          </div>

          {/* Availability (Read-only summary) */}
          {!isEditing && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Available Days
                </label>
                <p className="text-gray-700">{extractWeekdays(availability)}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Available Time
                </label>
                <p className="text-gray-700">
                  {extractTimeSlots(availability)}
                </p>
              </div>
            </>
          )}

          {/* Availability Editor (when editing) */}
          {isEditing && (
            <AvailabilityEditor
              availability={availability}
              setAvailability={setAvailability}
            />
          )}

          {/* Buttons */}
          {isEditing && (
            <div className="flex justify-between mt-6">
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

export default DoctorProfile;
