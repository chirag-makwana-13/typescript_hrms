import React from "react";
import "./Dashboard.css";
import Birthday from "./Birthday";
import Holiday from "./Holiday";
import Logs from "./Logs";
import Attendance from "./Attendance";
import TodayLogs from "./TodayLogs";

const Dashboard = () => {
  return (
    <div>
      <div className="dashboard-container">
        <div className="upper-container">
          <section className="dashboard-section">
            <Birthday />
          </section>
          <section className="dashboard-section">
            <Holiday />
          </section>
        </div>
        <section className="middle">
          <Attendance />
        </section>
        <div className="lower-container">
          <Logs />
        </div>
      </div>
      <section className="todaylogs-section">
        <TodayLogs />
      </section>
    </div>
  );
};

export default Dashboard;
