import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Doctor Scheduling System
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Please choose how you want to log in
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/login/user")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded text-lg shadow"
        >
          Login as User
        </button>

        <button
          onClick={() => navigate("/login/doctor")}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded text-lg shadow"
        >
          Are you a Doctor ?
        </button>
      </div>
    </div>
  );
};

export default Home;
