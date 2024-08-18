import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";
import axios from "../../utils/api";

// Define the types for the attendance record and the summary
interface AttendanceRecord {
  date: string;
  entry_time: string;
  exit_time: string;
  total_break_hours: string;
  net_working_hours: string;
  total_office_hours: number;
  total_present_days: number;
  total_late_days: number;  // Add this line
  total_half_days: number;
}
interface Summary {
  total_office_hours: number;
  total_present_days: number;
  total_late_days: number;
  total_half_days: number;
}

interface ParticularAttendanceProps {
  id: number | null;
  hide: () => void;
}

const ParticularAttendance: React.FC<ParticularAttendanceProps> = (props) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [summary, setSummary] = useState<Summary>({
    total_office_hours: 0,
    total_present_days: 0,
    total_late_days: 0,
    total_half_days: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleShowAttendance = async () => {
      try {
        const params = {
          page: currentPage,
        };

        const attendanceResponse = await axios.get(`/attendanceReport/?id=${props.id}`, {
          params,
        });
        const attendanceData = attendanceResponse.data.results as AttendanceRecord[];

        if (attendanceData.length > 0) {
          setAttendanceRecords(attendanceData);

          setSummary({
            total_office_hours: Number(attendanceData[0].total_office_hours),
            total_present_days: Number(attendanceData[0].total_present_days),
            total_late_days: Number(attendanceData[0].total_late_days),
            total_half_days: Number(attendanceData[0].total_half_days),
          });
        } else {
          setAttendanceRecords([]);
          setSummary({
            total_office_hours: 0,
            total_present_days: 0,
            total_late_days: 0,
            total_half_days: 0,
          });
        }
        setTotalPage(Math.ceil(attendanceResponse.data.count / 5));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      }
    };

    handleShowAttendance();
  }, [props.id, currentPage]);

  const formatTime = (datetime: string) => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <button onClick={props.hide} className="attendance-button">
        Back to Employee List
      </button>

      {/* Uncomment and use this section if you need to display attendance summary */}
      {/* <div className="attendance-summary">
        <h2>Attendance Summary</h2>
        <p>
          <strong>Total Office Hours:</strong> {summary.total_office_hours}
        </p>
        <p>
          <strong>Total Present Days:</strong> {summary.total_present_days}
        </p>
        <p>
          <strong>Total Late Days:</strong> {summary.total_late_days}
        </p>
        <p>
          <strong>Total Half Days:</strong> {summary.total_half_days}
        </p>
      </div> */}

      <div className="attendance-details">
        <h2>Attendance Records</h2>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Break Time</th>
              <th>Working Hours</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{formatTime(record.entry_time)}</td>
                <td>{formatTime(record.exit_time)}</td>
                <td>{record.total_break_hours.substring(0, 5)}</td>
                <td>{record.net_working_hours.substring(0, 5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default ParticularAttendance;
