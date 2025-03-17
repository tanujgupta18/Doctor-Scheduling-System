import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { lazy, Suspense } from "react";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const MedicalHistory = lazy(() => import("./pages/MedicalHistory"));

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <Suspense
            fallback={<div className="text-center mt-10">Loading...</div>}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/dashboard"
                element={<PrivateRoute element={<Dashboard />} />}
              />
              <Route
                path="/user-profile"
                element={<PrivateRoute element={<UserProfile />} />}
              />
              <Route
                path="/medical-history"
                element={<PrivateRoute element={<MedicalHistory />} />}
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;

// Best Version Before Medical History
