import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import ForgetPassword from "../components/Auth/ForgetPassword";
import Dashboard from "../components/Dashboard/Dashboard";
import EmployeeList from "../components/EmployeeList/EmployeeList";
import Navbar from "../components/Navbar/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import ChangePassword from "../components/Auth/ChangePassword";
import AttedanceReport from "../components/AttendanceReport/AttedanceReport";
import Leaves from "../components/Leaves/Leaves";
import MyCalendar from "../components/Calender/Calender";
import EmployeeProfile from "../components/EmployeeProfile/EmployeeProfile";
import Map from "../components/Map/Map";
import AdminAttendance from "../components/AttendanceReport/AdminAttendance ";

const HrmsRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Router>
      {isAuthenticated && <Navbar handleLogout={handleLogout} />}
      <div className={`content ${isAuthenticated ? "authenticated" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttedanceReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute>
                <AdminAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaves"
            element={
              <ProtectedRoute>
                <Leaves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <MyCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <Map />
              </ProtectedRoute>
            }
          />

          <Route
            path="/changepassword"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default HrmsRoutes;
