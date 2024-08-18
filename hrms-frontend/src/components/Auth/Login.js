import React, { useState } from "react";
import axios from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../store/AuthSlice";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);

  if (user) {
    return navigate("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login/", {
        username,
        password,
      });

      dispatch(
        loginSuccess({
          user: response.data.username,
          role: response.data.role,
          userId: response.data.userId,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          profile: response.data.profile,
        })
      );
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      onLogin();
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <p className="p">
            <Link to="/forgetpassword" style={{ textDecoration: "none" }}>
              Forget Password?
            </Link>
          </p>
          <p className="p">
            <Link to="/register" style={{ textDecoration: "none" }}>
              New Registration
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
