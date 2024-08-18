import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/api";
import "./Register.css";

const Register = () => {
  const [userData, setUserData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    date_of_joining: "",
    phone_number: "",
    address: "",
    dob: "",
    profile: null,
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleChangeFile = (e) => {
    setUserData({ ...userData, profile: e.currentTarget.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirm_password) {
      setErrors({ password: "Passwords do not match" });
      return;
    }
    try {
      await axios.post("/register/", userData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
    }
  };

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        {errors.general && <p className="error">{errors.general}</p>}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirm_password"
            value={userData.confirm_password}
            onChange={handleChange}
          />
          {errors.confirm_password && (
            <p className="error">{errors.confirm_password}</p>
          )}
        </div>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
          />
          {errors.first_name && <p className="error">{errors.first_name}</p>}
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
          />
          {errors.last_name && <p className="error">{errors.last_name}</p>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={userData.department}
            onChange={handleChange}
          />
          {errors.department && <p className="error">{errors.department}</p>}
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={userData.dob}
            onChange={handleChange}
          />
          {errors.dob && <p className="error">{errors.dob}</p>}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={userData.phone_number}
            onChange={handleChange}
          />
          {errors.phone_number && (
            <p className="error">{errors.phone_number}</p>
          )}
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleChange}
          />
          {errors.address && <p className="error">{errors.address}</p>}
        </div>
        <div className="form-group">
          <label>Date of Joining:</label>
          <input
            type="date"
            name="date_of_joining"
            value={userData.date_of_joining}
            onChange={handleChange}
          />
          {errors.date_of_joining && (
            <p className="error">{errors.date_of_joining}</p>
          )}
        </div>
        <div className="form-group">
          <label>Profile:</label>
          <input type="file" name="profile" onChange={handleChangeFile} />
          {errors.profile && <p className="error">{errors.profile}</p>}
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
        <p className="p">
          <Link to="/login" style={{ textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
