import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import "./TodayAttendance.css";

interface TodayLog {
  id: number;
  first_name: string;
  last_name: string;
  status: string;
  status_time: string;
}

interface TodayAttendanceProps {
  id: number | null;
  hide: () => void;
}

const TodayAttendance: React.FC<TodayAttendanceProps> = ({ id, hide }) => {
  const [todayLog, setTodayLog] = useState<TodayLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updateTime, setUpdateTime] = useState<string>(""); // State for input time

  useEffect(() => {
    const fetchTodayLog = async () => {
      try {
        const response = await axios.get(`/todayEmployeeActivity/${id}/`);
        setTodayLog([response.data]);
      } catch (error) {
        console.error("Error fetching today's attendance:", error);
        setError("Failed to fetch today's attendance.");
      }
    };

    fetchTodayLog();
  }, [id]);

  const handleUpdateStatusTime = async (logId: number) => {
    try {
      // Get today's date in YYYY-MM-DD format
      const todayDate = new Date().toISOString().split('T')[0];
      // Combine the date with the input time
      const formattedDateTime = `${todayDate}T${updateTime}:00`;

      const response = await axios.put(`/todayEmployeeActivity/${logId}/`, {
        status_time: formattedDateTime, // Use the formatted datetime string
      });
      setTodayLog((prevLogs) =>
        prevLogs.map((log) =>
          log.id === logId ? { ...log, status_time: response.data.status_time } : log
        )
      );
    } catch (error) {
      console.error("Error updating status time:", error);
      setError("Failed to update status time.");
    }
  };

  return (
    <div className="today-attendance-container">
      <h2>Today's Attendance</h2>
      {error && <p className="error-message">{error}</p>}
      <button onClick={hide} className="back-button">Back to Employee List</button>
      <table className="today-log-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Status</th>
            <th>Status Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {todayLog.map((log) => (
            <tr key={log.id}>
              <td>{log.first_name}</td>
              <td>{log.last_name}</td>
              <td>{log.status}</td>
              <td>{new Date(log.status_time).toLocaleTimeString()}</td>
              <td>
                <input
                  type="time"
                  value={updateTime}
                  onChange={(e) => setUpdateTime(e.target.value)}
                  className="time-input"
                />
                <button
                  onClick={() => handleUpdateStatusTime(log.id)}
                  className="update-button"
                >
                  Update Status Time
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodayAttendance;
