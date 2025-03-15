import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Home = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Doctor Scheduling System
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Sign in to book an appointment
      </p>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Google Sign-in Failed")}
      />
    </div>
  );
};

export default Home;
