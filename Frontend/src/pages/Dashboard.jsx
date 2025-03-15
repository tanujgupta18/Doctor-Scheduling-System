import React from "react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-8 p-6 text-center">
        <h2 className="text-3xl font-bold">Welcome to Your Dashboard</h2>
        <p className="text-lg text-gray-600 mt-4">
          You are successfully signed in.
        </p>
      </div>
    </>
  );
};

export default Dashboard;
