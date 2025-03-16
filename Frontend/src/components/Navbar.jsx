import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (user?.picture) {
      setProfilePic(user.picture);
    }
  }, [user?.picture]);

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-semibold">Doctor Scheduling</h1>
        {user && profilePic ? (
          <div className="flex items-center">
            <img
              src={profilePic}
              alt="User"
              className="w-9 h-9 rounded-full mr-5 block"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://i.pravatar.cc/150?u=fallback";
              }}
            />
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
