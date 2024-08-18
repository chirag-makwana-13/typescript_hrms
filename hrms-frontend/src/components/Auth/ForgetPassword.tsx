import React, { useState } from "react";
import axios from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

// Define the component's state types
const ForgetPassword: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/forgetpassword/", {
        username,
        new_password: newPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="forget-password-form-container">
      <div className="forget-password-form">
        <h2>Forget Password</h2>
        {message && <p className="message">{message}</p>}
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
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
