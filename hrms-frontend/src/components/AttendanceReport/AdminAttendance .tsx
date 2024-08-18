import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import "./AdminAttendance.css";
import ParticularAttendance from "./ParticularAttendance";
import TodayAttendance from "./TodayAttendance";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const AdminAttendance: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewAttendance, setViewAttendance] = useState<boolean>(false);
  const [viewTodayAttendance, setViewTodayAttendance] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get<Employee[]>("/employees/");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Failed to fetch employees.");
      }
    };

    fetchEmployees();
  }, []);

  const handleBackToEmployeeList = () => {
    setViewAttendance(false);
    setViewTodayAttendance(false);
  };

  const handleAttendanceData = (id: number) => {
    setViewAttendance(true);
    setUserId(id);
  };

  const handleTodayAttendanceData = (id: number) => {
    setViewTodayAttendance(true);
    setUserId(id);
  };

  return (
    <div className="admin-attendance-container">
      <h1>Admin Attendance View</h1>
      {error && <p className="error-message">{error}</p>}

      {!viewAttendance && !viewTodayAttendance ? (
        <table className="employee-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.first_name}</td>
                <td>{emp.last_name}</td>
                <td>{emp.email}</td>
                <td>
                  <button
                    onClick={() => handleAttendanceData(emp.id)}
                    className="attendance-button"
                  >
                    Show Attendance
                  </button>
                  <button
                    onClick={() => handleTodayAttendanceData(emp.id)}
                    className="today-button"
                  >
                    Today Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : viewAttendance ? (
        <ParticularAttendance id={userId} hide={handleBackToEmployeeList} />
      ) : (
        <TodayAttendance id={userId} hide={handleBackToEmployeeList} />
      )}
    </div>
  );
};

export default AdminAttendance;
