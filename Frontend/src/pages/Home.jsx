import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);

    if (!credentialResponse?.credential) {
      // console.error("No credential received from Google");
      alert("Google login failed. Please try again.");
      setLoading(false);
      return;
    }

    // console.log("Google Token Received:", credentialResponse.credential);

    try {
      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      // console.log("Sending request to backend...");

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      // console.log("Server Response:", data);

      if (data?.success && data?.user && data?.token) {
        login(data.user, data.token);
        navigate("/dashboard");
      } else {
        // console.error("Unexpected server response format:", data);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      // console.error("Login Failed:", error);
      alert("Google Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Doctor Scheduling System</h1>

      {loading ? (
        <p className="text-gray-600">Processing login...</p>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert("Google Sign-in Failed")}
        />
      )}
    </div>
  );
};

export default Home;
