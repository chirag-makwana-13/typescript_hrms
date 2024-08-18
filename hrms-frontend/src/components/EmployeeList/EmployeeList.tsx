import React, { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { debounce } from "lodash";
import axios from "../../utils/api";
import "./EmployeeList.css";

// Define types for the employee data and form data
interface Employee {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  relationship_status: string;
  department: string;
  date_of_joining: string;
  phone_number: string;
  address: string;
  profile: string;
  is_staff: boolean;
  bio: string;
}

interface FormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  relationship_status: string;
  department: string;
  date_of_joining: string;
  phone_number: string;
  address: string;
  profile: File | string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingEmployee, setEditingEmployee] = useState<number | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [hrEmployee, setHrEmployee] = useState<Employee | null>(null);
  const [message, setMessage] = useState<string>("");
  const [searchEmployee, setSearchEmployee] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    relationship_status: "",
    department: "",
    date_of_joining: "",
    phone_number: "",
    address: "",
    profile: "",
  });

  const { register } = useForm();

  const handleSearch = useCallback(
    debounce((searchEmployee: string) => {
      setSearchEmployee(searchEmployee);
    }, 300),
    []
  );

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    handleSearch(searchTerm);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get("/auth/user/");
        setCurrentUser(userResponse.data);
        setIsAdmin(userResponse.data.is_staff);

        const employeesResponse = await axios.get("/employees/", {
          params: {
            search: searchEmployee,
          },
        });
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [searchEmployee]);

  const handleDelete = async (id: number) => {
    try {
      await axios.put(`/employees/${id}/`, {
        is_deleted: 1,
      });
      setEmployees(employees.filter((employee) => employee.id !== id));
      setMessage("Employee deleted successfully");
      setDeletingEmployee(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee. Please try again later.");
    }
  };

  const handleEdit = (employee: Employee) => {
    if (currentUser && (isAdmin || currentUser.id === employee.id)) {
      setEditingEmployee(employee.id);
      setFormData({
        username: employee.username,
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        gender: employee.gender,
        relationship_status: employee.relationship_status,
        department: employee.department,
        date_of_joining: employee.date_of_joining,
        phone_number: employee.phone_number,
        address: employee.address,
        profile: employee.profile,
      });
    } else {
      setError("You do not have permission to edit this employee.");
    }
  };

  const handleHR = (employee: Employee) => {
    setHrEmployee(employee);
  };

  const confirmHR = async (id: number) => {
    try {
      await axios.put(`/employees/${id}/`, {
        is_staff: true,
      });
      setEmployees(
        employees.map((emp) =>
          emp.id === id ? { ...emp, is_staff: true } : emp
        )
      );
      setMessage("Employee promoted to HR successfully");
      setHrEmployee(null);
    } catch (error) {
      console.error("Error promoting employee:", error);
      setError("Failed to promote employee. Please try again later.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setFormData((prevData) => ({ ...prevData, profile: file }));
    } else {
      alert("Please select a valid image file (jpg, jpeg, png).");
    }
  };

  const handleUpdate = async (id: number) => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await axios.put(`/employees/${id}/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEmployees(
        employees.map((emp) => (emp.id === id ? { ...emp, ...formData } : emp))
      );
      setMessage("Employee updated successfully");
      setEditingEmployee(null);
    } catch (error) {
      console.error("Error updating employee:", error);
      setError("Failed to update employee. Please try again later.");
    }
  };

  return (
    <div className="employee-list-container">
      <h1>Employee List</h1>
      <form>
        <input
          type="text"
          placeholder="Search..."
          {...register("search", {
            onChange: (e) => handleChangeSearch(e),
          })}
          className="search"
        />
      </form>
      <br />
      {error && <p className="error-message">{error}</p>}
      {message && <p className="message">{message}</p>}
      <br />
      {employees.length > 0 ? (
        <>
          <div className="employee-cards">
            {employees.map((employee) => (
              <div key={employee.id} className="employee-card">
                <img
                  src={
                    employee.profile
                      ? employee.profile
                      : "https://via.placeholder.com/200"
                  }
                  alt={employee.username}
                  style={{
                    height: "300px",
                    width: "290px",
                    borderRadius: "15px",
                  }}
                  onClick={() => setSelectedEmployee(employee)}
                />
                <div className="card-body">
                  <h2>{employee.department}</h2>
                  <p style={{ fontSize: "20px" }}>
                    {employee.first_name} {employee.last_name}
                  </p>
                  {(isAdmin ||
                    (currentUser && currentUser.id === employee.id)) && (
                    <div className="button-group">
                      <button
                        className="yes-button"
                        onClick={() => handleEdit(employee)}
                      >
                        Edit
                      </button>
                      <button
                        className="cancel-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingEmployee(employee.id);
                        }}
                      >
                        Delete
                      </button>
                      {!employee.is_staff && (
                        <button
                          className="yes-button"
                          onClick={() => handleHR(employee)}
                        >
                          HR
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedEmployee && (
            <div className="custom-modal">
              <div className="custom-modal-header">
                <span
                  className="close"
                  onClick={() => setSelectedEmployee(null)}
                >
                  &times;
                </span>
                <h2 className="custom-modal-title">
                  {selectedEmployee.first_name} {selectedEmployee.last_name}
                </h2>
              </div>
              <div className="employee-detail-container">
                <div className="left-details">
                  <p className="datahotline">
                    <strong className="datastrong">First Name:</strong>{" "}
                    {selectedEmployee.first_name}
                  </p>
                  <p className="datahotline">
                    <strong className="datastrong">Last Name:</strong>{" "}
                    {selectedEmployee.last_name}
                  </p>
                  <p className="datahotline">
                    <strong className="datastrong">Username:</strong>{" "}
                    {selectedEmployee.username}
                  </p>
                  <p className="datahotline">
                    <strong className="datastrong">Email:</strong>{" "}
                    {selectedEmployee.email}
                  </p>
                  <p className="datahotline">
                    <strong className="datastrong">Gender:</strong>{" "}
                    {selectedEmployee.gender}
                  </p>
                  <p className="datahotline">
                    <strong className="datastrong">Department:</strong>{" "}
                    {selectedEmployee.department}
                  </p>
                  <p className="datahotline">
                    <strong className="datastrong">Phone:</strong>{" "}
                    {selectedEmployee.phone_number}
                  </p>
                  <p className="datahotline">
                    <strong className="datastrong">Address:</strong>{" "}
                    {selectedEmployee.address}
                  </p>
                </div>
                <div className="middle-details">
                  <p className="datahotline">
                    <strong className="datastrong">Bio:</strong>{" "}
                    {selectedEmployee.bio}
                  </p>
                </div>
                <div className="right-details">
                  <img
                    src={
                      selectedEmployee.profile
                        ? selectedEmployee.profile
                        : "https://via.placeholder.com/200"
                    }
                    alt={selectedEmployee.username}
                    style={{
                      height: "300px",
                      width: "300px",
                      borderRadius: "15px",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No employees found.</p>
      )}

      {editingEmployee && (
        <div className="edit-modal">
          <h2>Edit Employee</h2>
          <form onSubmit={() => handleUpdate(editingEmployee)}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Gender"
            />
            <input
              type="text"
              name="relationship_status"
              value={formData.relationship_status}
              onChange={handleChange}
              placeholder="Relationship Status"
            />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Department"
            />
            <input
              type="date"
              name="date_of_joining"
              value={formData.date_of_joining}
              onChange={handleChange}
              placeholder="Date of Joining"
            />
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
            <input
              type="file"
              name="profile"
              onChange={handleFileChange}
              placeholder="Profile Image"
            />
            <button type="submit">Update</button>
            <button
              type="button"
              onClick={() => setEditingEmployee(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {hrEmployee && (
        <div className="hr-modal">
          <h2>Promote to HR</h2>
          <p>
            Are you sure you want to promote{" "}
            {hrEmployee.first_name} {hrEmployee.last_name} to HR?
          </p>
          <button onClick={() => confirmHR(hrEmployee.id)}>Yes</button>
          <button onClick={() => setHrEmployee(null)}>No</button>
        </div>
      )}

      {deletingEmployee && (
        <div className="delete-modal">
          <h2>Confirm Delete</h2>
          <p>
            Are you sure you want to delete this employee? This action cannot
            be undone.
          </p>
          <button onClick={() => handleDelete(deletingEmployee)}>Yes</button>
          <button onClick={() => setDeletingEmployee(null)}>No</button>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
