import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import "./Dashboard.css";

// Define types for logs and breaks
interface BreakItem {
  breakIn: string;
  breakOut: string;
}

interface LogItem {
  checkIn: string;
  breaks: BreakItem[];
  checkOut: string;
}

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [error, setError] = useState<string>("");
  const [buttonsState, setButtonsState] = useState({
    checkIn: false,
    breakIn: true,
    breakOut: true,
    checkOut: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsResponse] = await Promise.all([
          axios.get<LogItem[]>("/employeeDailyLogs/"),
        ]);

        setLogs(logsResponse.data);
        updateButtonState(logsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const updateButtonState = (logs: LogItem[]) => {
    if (logs.length > 0) {
      const latestLog = logs[logs.length - 1];
      if (!latestLog.checkIn) {
        setButtonsState({
          checkIn: false,
          breakIn: true,
          breakOut: true,
          checkOut: true,
        });
      } else if (
        latestLog.checkIn &&
        !latestLog.breaks.length &&
        !latestLog.checkOut
      ) {
        setButtonsState({
          checkIn: true,
          breakIn: false,
          breakOut: true,
          checkOut: false,
        });
      } else if (
        latestLog.breaks.length &&
        !latestLog.breaks[latestLog.breaks.length - 1].breakOut &&
        !latestLog.checkOut
      ) {
        setButtonsState({
          checkIn: true,
          breakIn: true,
          breakOut: false,
          checkOut: true,
        });
      } else if (
        latestLog.checkIn &&
        latestLog.breaks.length &&
        latestLog.breaks[latestLog.breaks.length - 1].breakOut &&
        !latestLog.checkOut
      ) {
        setButtonsState({
          checkIn: true,
          breakIn: false,
          breakOut: true,
          checkOut: false,
        });
      } else {
        setButtonsState({
          checkIn: true,
          breakIn: true,
          breakOut: true,
          checkOut: true,
        });
      }
    }
  };

  const handleAction = async (action: string) => {
    try {
      await axios.post(`/${action}/`);
      const logsResponse = await axios.get<LogItem[]>("/employeeDailyLogs/");
      setLogs(logsResponse.data);
      updateButtonState(logsResponse.data);
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
      setError(`Failed to ${action}. Please try again later.`);
    }
  };

  const formatTime1 = (datetime: string) => {
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

  return (
    <div>
      <div>
        <div className="lower-container">
          {error && <p className="error-message">{error}</p>}
          <h2>Today's Action</h2>
          <div className="actions">
            <button
              onClick={() => handleAction("checkin")}
              disabled={buttonsState.checkIn}
              className={`action-button ${
                buttonsState.checkIn ? "disabled" : "checkin"
              }`}
            >
              Check In
            </button>
            <button
              onClick={() => handleAction("breakin")}
              disabled={buttonsState.breakIn}
              className={`action-button ${
                buttonsState.breakIn ? "disabled" : "breakin"
              }`}
            >
              Break In
            </button>
            <button
              onClick={() => handleAction("breakout")}
              disabled={buttonsState.breakOut}
              className={`action-button ${
                buttonsState.breakOut ? "disabled" : "breakout"
              }`}
            >
              Break Out
            </button>
            <button
              onClick={() => handleAction("checkout")}
              disabled={buttonsState.checkOut}
              className={`action-button ${
                buttonsState.checkOut ? "disabled" : "checkout"
              }`}
            >
              Check Out
            </button>
          </div>

          <section className="logs-section">
            <h2>Logs</h2>
            <div className="card">
              {logs.length > 0 ? (
                <>
                  {logs.map((log, index) => (
                    <div key={index} className="login-card">
                      <p className="p">
                        <strong>Check In:</strong> {formatTime1(log.checkIn)}
                      </p>
                      {log.breaks.length > 0 &&
                        log.breaks.map((breakItem, index) => (
                          <div key={index}>
                            <p className="p">
                              <strong>Break In:</strong>{" "}
                              {formatTime1(breakItem.breakIn)}
                            </p>
                            <p className="p">
                              <strong>Break Out:</strong>{" "}
                              {formatTime1(breakItem.breakOut)}
                            </p>
                          </div>
                        ))}
                      <p className="p">
                        <strong>Check Out:</strong> {formatTime1(log.checkOut)}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <h4>No logs available.</h4>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Logs;
