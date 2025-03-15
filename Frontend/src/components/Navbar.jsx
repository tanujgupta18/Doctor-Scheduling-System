import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-semibold">Doctor Scheduling</h1>
        {user ? (
          <div className="flex items-center">
            <img
              src={user.picture}
              alt="User"
              className="w-8 h-8 rounded-full mr-2"
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
