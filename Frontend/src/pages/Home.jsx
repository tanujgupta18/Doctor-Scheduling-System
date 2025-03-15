import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      // console.log("Google Token Received:", credentialResponse.credential);
      const response = await fetch("http://localhost:5000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await response.json();
      // console.log("Server Response:", data);

      if (data.token) {
        login(
          {
            name: data.user.name,
            email: data.user.email,
            picture: data.user.picture,
          },
          data.token
        );
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Doctor Scheduling System</h1>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Google Sign-in Failed")}
      />
    </div>
  );
};

export default Home;
