import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-semibold">Doctor Scheduling</h1>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
