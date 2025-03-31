import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../context/AuthContext";

const DoctorLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: credentialResponse.credential,
          role: "doctor",
        }),
      });

      const data = await response.json();
      if (data.success && data.user && data.token) {
        login(data.user, data.token);
        navigate("/doctor-dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      alert("Google Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Login as Doctor</h1>
      {loading ? (
        <p>Processing login...</p>
      ) : (
        <GoogleLogin onSuccess={handleSuccess} />
      )}
    </div>
  );
};

export default DoctorLogin;
