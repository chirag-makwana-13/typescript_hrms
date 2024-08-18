import React, { useState } from "react";
import axios from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

const ChangePassword: React.FC = () => {
  // Define state variables with appropriate types
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = (): boolean => {
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.put("/changepassword/", {
        current_password: password,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Current password wrong OR Password must contain at least 8 characters"
      );
    }
  };

  return (
    <div className="change-password-form-container">
      <div className="change-password-form">
        <h2>Change Password</h2>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-button">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
