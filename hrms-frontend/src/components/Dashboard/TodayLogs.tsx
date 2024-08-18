import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import "./Dashboard.css";

// Define types for the log data
interface TodayLogItem {
  first_name: string;
  last_name: string;
  status: string;
  status_time: string;
}

const TodayLogs: React.FC = () => {
  const [todaylogs, setTodaylogs] = useState<TodayLogItem[]>([]);
  const [searchTodaylogs, setSearchtodaylogs] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todaylogsResponse = await axios.get<TodayLogItem[]>("/todayEmployeeActivity/", {
          params: {
            search: searchTodaylogs,
          },
        });
        setTodaylogs(todaylogsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [searchTodaylogs]);

  const formatTime1 = (datetime: string): string => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    // Check if the date is valid
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleFetch = () => {
    axios
      .get<TodayLogItem[]>("/todayEmployeeActivity/", {
        params: {
          search: searchTodaylogs,
        },
      })
      .then((response) => {
        setTodaylogs(response.data);
      })
      .catch((error) => {
        console.error("Cannot fetch data", error);
      });
  };

  return (
    <div>
      <section className="todaylogs-section">
        <h2>Today's All Logs</h2>
        <input
          placeholder="Search Here"
          onChange={(event) => setSearchtodaylogs(event.target.value)}
          className="search"
        />
        <button className="refresh" onClick={handleFetch}>
          Refresh
        </button>
        <br />
        <br />
        <div className="todaycard">
          {todaylogs.length > 0 ? (
            <>
              {todaylogs.map((todaylog, index) => (
                <div key={index} className="todaylog-card">
                  <p className="p">{`${todaylog.first_name} ${
                    todaylog.last_name
                  } ${todaylog.status} ${formatTime1(
                    todaylog.status_time
                  )}`}</p>
                </div>
              ))}
            </>
          ) : (
            <h4>No logs available.</h4>
          )}
        </div>
      </section>
    </div>
  );
};

export default TodayLogs;
