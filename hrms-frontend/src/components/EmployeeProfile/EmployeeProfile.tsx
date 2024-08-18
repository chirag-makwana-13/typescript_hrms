import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import api from "../../utils/api";
import "./EmployeeProfile.css";
import { useSelector } from "react-redux";

interface RootState {
  user: {
    userId: string;
  };
}

interface Employee {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  relationship_status: string;
  department: string;
  dob: string;
  phone_number: string;
  address: string;
  bio: string;
  profile: string | null;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  relationship_status: string;
  department: string;
  dob: string;
  phone_number: string;
  address: string;
  bio: string;
  profile: File | null;
}

const EmployeeProfile: React.FC = () => {
  const { userId } = useSelector((state: RootState) => state.user || {});
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    relationship_status: "",
    department: "",
    dob: "",
    phone_number: "",
    address: "",
    bio: "",
    profile: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!userId) return;  // Early return if userId is not available

    const fetchEmployeeData = async () => {
      try {
        const response = await api.get<Employee>(`/profile/${userId}/`);
        setEmployee(response.data);
        setFormData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          gender: response.data.gender || "",
          relationship_status: response.data.relationship_status || "",
          department: response.data.department || "",
          dob: response.data.dob || "",
          phone_number: response.data.phone_number || "",
          address: response.data.address || "",
          bio: response.data.bio || "",
          profile: response.data.profile || null,
        });
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError("Failed to load employee data.");
      }
    };

    fetchEmployeeData();
  }, [userId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setFormData((prevData) => ({ ...prevData, profile: file }));
    } else {
      alert("Please select a valid image file (jpg, jpeg, png).");
    }
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedData = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        updatedData.append(key, formData[key] as any);
      }
    }

    try {
      await api.put(`/profile/${userId}/`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating employee data:", error);
      setError("Failed to update profile. Please try again later.");
    }
  };

  if (!employee) {
    return <p>Loading...</p>;
  }

  return (
    <div className="employee-profile-container">
      <h1>Update Your Profile</h1>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleUpdate}>
        <label>First Name:</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <label>Last Name:</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <label>Gender:</label>
        <input
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        />
        <label>Relationship Status:</label>
        <input
          type="text"
          name="relationship_status"
          value={formData.relationship_status}
          onChange={handleChange}
        />
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
        <label>Phone Number:</label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
        />
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <label>Bio:</label>
        <input
          type="text"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
        />
        <label>Profile Image:</label>
        <input type="file" name="profile" onChange={handleFileChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EmployeeProfile;
