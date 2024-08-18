import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "../../utils/api";
import Pagination from "../Pagination";
import "./Leaves.css";

// Define the types for leave and leave details
interface Leave {
  id: number;
  date: string;
  type: string;
  status: string;
  reason: string;
  leave_day_type: string;
}

interface LeaveDetails {
  remaining_paid_leave: number;
  remaining_unpaid_leave: number;
  remaining_casual_leave: number;
  remaining_sick_leave: number;
  total_approved_leaves: number;
  first_name: string;
  last_name: string;
}

interface NewLeave {
  date: string;
  type: string;
  reason: string;
  leave_day_type?: string; // Optional field
}

// Define the state types
interface LeavesState {
  leaves: Leave[];
  currentPage: number;
  totalPage: number;
  leaveDetails: LeaveDetails;
  newLeave: NewLeave;
  error: string;
  isModalOpen: boolean;
  isAdmin: boolean;
}

const Leaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [leaveDetails, setLeaveDetails] = useState<LeaveDetails>({
    remaining_paid_leave: 0,
    remaining_unpaid_leave: 0,
    remaining_casual_leave: 0,
    remaining_sick_leave: 0,
    total_approved_leaves: 0,
    first_name: "",
    last_name: "",
  });
  const [newLeave, setNewLeave] = useState<NewLeave>({
    date: "",
    type: "",
    reason: "",
    leave_day_type: "Full_Day",
  });
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const params = {
      page: currentPage,
    };

    const fetchData = async () => {
      try {
        const [
          leavesResponse,
          leaveDetailsResponse,
          userResponse,
        ] = await Promise.all([
          (!isAdmin &&
            axios.get<{ results: Leave[]; count: number }>("/leave/", {
              params,
            })) ||
            (isAdmin && axios.get<Leave[]>("/all-leaves/")),
          axios.get<LeaveDetails>("/leave-details/"),
          axios.get<{ is_staff: boolean }>("/auth/user/"),
        ]);

        if (isAdmin) {
          setLeaves(leavesResponse.data);
        } else {
          setLeaves(leavesResponse.data.results);
          setTotalPage(Math.ceil(leavesResponse.data.count / 5));
        }
        setLeaveDetails(leaveDetailsResponse.data);
        setIsAdmin(userResponse.data.is_staff);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [currentPage, isAdmin]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLeave((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("/leave/", newLeave);
      setNewLeave({
        date: "",
        type: "",
        reason: "",
        leave_day_type: "Full_Day",
      });
      const leavesResponse = await axios.get<{ results: Leave[] }>("/leave/");
      setLeaves(leavesResponse.data.results);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to submit leave application:", error);
      setError("Failed to submit leave application. Please try again later.");
    }
  };

  const handleApprove = async (leaveId: number) => {
    try {
      await axios.patch(`/update-leave-status/${leaveId}/`, {
        status: "Approved",
      });
      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === leaveId ? { ...leave, status: "Approved" } : leave
        )
      );
    } catch (error) {
      console.error("Failed to approve leave:", error);
      setError("Failed to approve leave. Please try again later.");
    }
  };

  const handleRejected = async (leaveId: number) => {
    try {
      await axios.patch(`/update-leave-status/${leaveId}/`, {
        status: "Rejected",
      });
      setLeaves((prev) =>
        prev.map((leave) =>
          leave.id === leaveId ? { ...leave, status: "Rejected" } : leave
        )
      );
    } catch (error) {
      console.error("Failed to reject leave:", error);
      setError("Failed to reject leave. Please try again later.");
    }
  };

  return (
    <div className="leaves-container">
      {isAdmin ? (
        <div className="admin-leave-list">
          <h2>All Leaves</h2>
          <table className="leave-table admin">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Leave Day Type</th>
                <th>Action</th>
              </tr>
            </thead>
            {leaves.length > 0 ? (
              <tbody>
                {leaves.map((allleave, index) => (
                  <tr key={allleave.id}>
                    <td>{index + 1}</td>
                    <td>{new Date(allleave.date).toLocaleDateString()}</td>
                    <td>{allleave.type}</td>
                    <td>{allleave.status}</td>
                    <td>{allleave.reason || "-"}</td>
                    <td>{allleave.leave_day_type}</td>
                    {allleave.status === "Pending" ? (
                      <td>
                        <button
                          className="add-leave-button"
                          onClick={() => handleApprove(allleave.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="remove-leave-button"
                          onClick={() => handleRejected(allleave.id)}
                        >
                          Reject
                        </button>
                      </td>
                    ) : (
                      <td></td>
                    )}
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={7}>
                    <h4>No leaves list found.</h4>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      ) : (
        <>
          <h1>Leave Balance</h1>
          <div className="lcard">
            <p className="plcard p">
              Paid Leave (PL): {leaveDetails.remaining_paid_leave}
            </p>
            <p className="ulcard p">
              Unpaid Leave (UL): {leaveDetails.remaining_unpaid_leave}
            </p>
            <p className="clcard p">
              Casual Leave (CL): {leaveDetails.remaining_casual_leave}
            </p>
            <p className="slcard p">
              Sick Leave (SL): {leaveDetails.remaining_sick_leave}
            </p>
            <p className="tlcard p">
              Total Approved Leaves: {leaveDetails.total_approved_leaves}
            </p>
            <h4>
              Name: {leaveDetails.first_name} {leaveDetails.last_name}
            </h4>
          </div>
          <div className="leave-actions">
            <button
              className="add-leave-button"
              onClick={() => setIsModalOpen(true)}
            >
              Add Leave
            </button>
          </div>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={() => setIsModalOpen(false)}>
                  &times;
                </span>
                <h3>Apply for Leave</h3>
                <form onSubmit={handleSubmit}>
                  <label>
                    Date:
                    <input
                      type="date"
                      name="date"
                      value={newLeave.date}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Type:
                    <br />
                    <br />
                    <select
                      name="type"
                      style={{ height: "30px", width: "500px" }}
                      value={newLeave.type}
                      onChange={handleInputChange}
                    >
                      <option value="Casual">Casual</option>
                      <option value="Sick">Sick</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </label>
                  <label>
                    Reason:
                    <textarea
                      name="reason"
                      value={newLeave.reason}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Leave Day Type:
                    <select
                      name="leave_day_type"
                      value={newLeave.leave_day_type}
                      onChange={handleInputChange}
                    >
                      <option value="Full_Day">Full Day</option>
                      <option value="Half_Day">Half Day</option>
                    </select>
                  </label>
                  <button type="submit">Submit</button>
                </form>
                {error && <p className="error">{error}</p>}
              </div>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Leaves;
