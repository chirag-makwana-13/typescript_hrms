import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../utils/api";
import "./AttedanceReport.css";
import Pagination from "../Pagination";

interface AttendanceReport {
  id: number;
  date: string;
  entry_time: string | null;
  exit_time: string | null;
  total_break_hours: string;
  net_working_hours: string;
}

interface DataReport {
  total_present_days: string;
  total_office_hours: string;
  total_working_hours: string;
  total_late_days: string;
  total_half_days: string;
}


const AttedanceReport: React.FC = () => {
  const [attendancereport, setAttedancereport] = useState<AttendanceReport[]>([]);
  const [dataReport, setDataReport] = useState<DataReport>({
    total_present_days: "",
    total_office_hours: "",
    total_working_hours: "",
    total_late_days: "",
    total_half_days: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>("thisMonth");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: Record<string, string | number> = {
          page: currentPage,
          filterType: filterType,
        };

        if (filterType === "custom") {
          params.start_date = customStartDate;
          params.end_date = customEndDate;
        }

        const attendancereportResponse = await axios.get("/attendanceReport/", {
          params,
        });
        setAttedancereport(attendancereportResponse.data.results);
        const dataAdd = attendancereportResponse.data.results[0];
        setDataReport({
          total_present_days: dataAdd.total_present_days,
          total_office_hours: dataAdd.total_office_hours,
          total_working_hours: dataAdd.total_working_hours,
          total_late_days: dataAdd.total_late_days,
          total_half_days: dataAdd.total_half_days,
        });
        setTotalPage(Math.ceil(attendancereportResponse.data.count / 5));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("No Data");
      }
    };

    fetchData();
  }, [currentPage, filterType, customStartDate, customEndDate]);

  const formatTime1 = (datetime: string | null): string => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handlePageChage = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  const handleCustomStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomStartDate(e.target.value);
  };

  const handleCustomEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomEndDate(e.target.value);
  };

  const secondsToHms = (d: string | number): string => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hrs, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " mins " : " mins ") : "";
    return hDisplay + mDisplay;
  };

  return (
    <div className="attendance-list-container">
      <h1>Attendace-Report List</h1>
      <div className="lcard">
        <p className="ulcard p">
          <strong>Days: </strong>
          {dataReport.total_present_days}
        </p>
        <p className="plcard p">
          <strong>Late: </strong>
          {dataReport.total_late_days}
        </p>
        <p className="ulcard p">
          <strong>Half Days: </strong>
          {dataReport.total_half_days}
        </p>
        <p className="plcard p">
          <strong>Total Office: </strong>
          {dataReport.total_office_hours}
        </p>
        <p className="ulcard p">
          <strong>Total worked: </strong>
          {secondsToHms(dataReport.total_working_hours)}
        </p>
      </div>
      <br />

      <div className="filter-container">
        <label htmlFor="filterType">Filter By:</label>
        <select
          id="filterType"
          value={filterType}
          onChange={handleFilterChange}
        >
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {filterType === "custom" && (
          <div className="custom-date-range">
            <label htmlFor="customStartDate">Start Date:</label>
            <input
              type="date"
              id="customStartDate"
              value={customStartDate}
              onChange={handleCustomStartDateChange}
            />

            <label htmlFor="customEndDate">End Date:</label>
            <input
              type="date"
              id="customEndDate"
              value={customEndDate}
              onChange={handleCustomEndDateChange}
            />
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Date</th>
            <th>Entry Time</th>
            <th>Exit Time</th>
            <th>Break Time</th>
            <th>Working Hours</th>
          </tr>
        </thead>
        {attendancereport.length > 0 ? (
          <tbody>
            {attendancereport.map((attendance, index) => (
              <tr key={attendance.id}>
                <td>{index + 1}</td>
                <td>{attendance.date}</td>
                <td>{formatTime1(attendance.entry_time)}</td>
                <td>{formatTime1(attendance.exit_time)}</td>
                <td>{attendance.total_break_hours.substring(0, 5)}</td>
                <td>{attendance.net_working_hours.substring(0, 5)}</td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={6}>
                <h4>No Attendance Report found.</h4>
              </td>
            </tr>
          </tbody>
        )}
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={handlePageChage}
      />
    </div>
  );
};

export default AttedanceReport;
