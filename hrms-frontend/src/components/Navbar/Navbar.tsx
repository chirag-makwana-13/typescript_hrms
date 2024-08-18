import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import "./Navbar.css";
import { RootState } from "../../store/store";

// Define types for props
interface NavbarProps {
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleLogout }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState<string>("");

  // Use useSelector with RootState
  const { firstName, lastName, profile, role } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setActiveLink(path ? path : "home");
  }, [location]);

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="nav-header">HRMS</div>
        <ul className="nav-links">
          <li>
            <Link
              to="/dashboard"
              className={activeLink === "dashboard" ? "active" : ""}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/employees"
              className={activeLink === "employees" ? "active" : ""}
            >
              Hotline
            </Link>
          </li>
          <li>
            <Link
              to={role === "admin" ? "/admin/attendance" : "/attendance"}
              className={activeLink === "attendance" ? "active" : ""}
            >
              Attendance
            </Link>
          </li>
          <li>
            <Link
              to="/leaves"
              className={activeLink === "leaves" ? "active" : ""}
            >
              Leaves
            </Link>
          </li>
          <li>
            <Link
              to="/calendar"
              className={activeLink === "calendar" ? "active" : ""}
            >
              Calendar
            </Link>
          </li>
          <li>
            <Link to="/map" className={activeLink === "map" ? "active" : ""}>
              Map
            </Link>
          </li>
          <li>
            <Link
              to="/changepassword"
              className={activeLink === "changepassword" ? "active" : ""}
            >
              Change Password
            </Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>
      <div
        className="top-bar"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div>
          <h1>{activeLink.charAt(0).toUpperCase() + activeLink.slice(1)}</h1>
        </div>
        <Link
          to="/profile"
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            marginRight: "70px",
            textDecoration: "none",
          }}
        >
          <img
            src={
              profile
                ? `http://127.0.0.1:8000${profile}`
                : "https://via.placeholder.com/50"
            }
            alt="Profile"
            style={{
              height: "70px",
              width: "70px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          <h2>
            {firstName} {lastName}
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
