import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { lazy, Suspense } from "react";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const DoctorProfile = lazy(() => import("./pages/DoctorProfile"));
const MedicalHistory = lazy(() => import("./pages/MedicalHistory"));
const UserLogin = lazy(() => import("./pages/UserLogin"));
const DoctorLogin = lazy(() => import("./pages/DoctorLogin"));

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
              {/* Landing Page */}
              <Route path="/" element={<Home />} />

              {/* Login Routes */}
              <Route path="/login/user" element={<UserLogin />} />
              <Route path="/login/doctor" element={<DoctorLogin />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={<PrivateRoute element={<Dashboard />} />}
              />
              <Route
                path="/doctor-dashboard"
                element={<PrivateRoute element={<DoctorDashboard />} />}
              />
              <Route
                path="/user-profile"
                element={<PrivateRoute element={<UserProfile />} />}
              />
              <Route
                path="/doctor-profile"
                element={<PrivateRoute element={<DoctorProfile />} />}
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
