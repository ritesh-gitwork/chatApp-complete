import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import SettingPage from "./pages/SettingPage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Navbar from "./components/Navbar"; // <-- add

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // Avoid re-creating effect if store recreates function
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar /> {/* <-- now visible, fixed at top */}
      {/* Push content below fixed navbar (h-16) */}
      <div className="pt-16 min-h-screen">
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={
              authUser ? <ProfilePage /> : <Navigate to="/login" replace />
            }
          />
          {/* make path match your Navbar link `/settings` */}
          <Route
            path="/settings"
            element={
              authUser ? <SettingPage /> : <Navigate to="/login" replace />
            }
          />

          {/* Public Routes */}
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignupPage /> : <Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
