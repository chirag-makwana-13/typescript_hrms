import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import { useSelector } from "react-redux";
import "./Dashboard.css";
import { RootState } from "../../store/store";

// Define types for the holiday data
interface HolidayType {
  id: number;
  name: string;
  date: string;
  holiday_image: string;
}

// Define the type for the Redux state

const Holiday: React.FC = () => {
  const role = useSelector((state: RootState) => state.auth.role);
  const [holidays, setHolidays] = useState<HolidayType[]>([]);
  const [currentHolidayPage, setCurrentHolidayPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [showAddHolidayModal, setShowAddHolidayModal] = useState<boolean>(false);
  const [showUpdateHolidayModal, setShowUpdateHolidayModal] = useState<boolean>(false);
  const [currentHoliday, setCurrentHoliday] = useState<HolidayType | null>(null);
  const [newHoliday, setNewHoliday] = useState<{
    name: string;
    date: string;
    holiday_image: File | null;
  }>({
    name: "",
    date: "",
    holiday_image: null,
  });

  // Correctly access the role from the user slice

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<HolidayType[]>("/holidays/");
        setHolidays(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleAddHoliday = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const formData = new FormData();
      formData.append("name", newHoliday.name);
      formData.append("date", newHoliday.date);
      if (newHoliday.holiday_image)
        formData.append("holiday_image", newHoliday.holiday_image);

      await axios.post("/holidays/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const holidaysResponse = await axios.get<HolidayType[]>("/holidays/");
      setHolidays(holidaysResponse.data);
      setShowAddHolidayModal(false);
      setNewHoliday({ name: "", date: "", holiday_image: null });
    } catch (error) {
      console.error("Failed to add holiday:", error);
      setError("Failed to add holiday. Please try again later.");
    }
  };

  const handleUpdateHoliday = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    if (!currentHoliday) return;

    try {
      const formData = new FormData();
      formData.append("name", newHoliday.name);
      formData.append("date", newHoliday.date);
      if (newHoliday.holiday_image)
        formData.append("holiday_image", newHoliday.holiday_image);

      await axios.put(`/holidays/${currentHoliday.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const holidaysResponse = await axios.get<HolidayType[]>("/holidays/");
      setHolidays(holidaysResponse.data);
      setShowUpdateHolidayModal(false);
      setNewHoliday({ name: "", date: "", holiday_image: null });
    } catch (error) {
      console.error("Failed to update holiday:", error);
      setError("Failed to update holiday. Please try again later.");
    }
  };

  const handleDeleteHoliday = async (holiday: HolidayType) => {
    const { date, name } = holiday;

    try {
      await axios.put(`/holidays/${holiday.id}/`, {
        date,
        name,
        is_deleted: 1,
      });
      const holidaysResponse = await axios.get<HolidayType[]>("/holidays/");
      setHolidays(holidaysResponse.data);
    } catch (error) {
      console.error("Failed to delete holiday:", error);
      setError("Failed to delete holiday. Please try again later.");
    }
  };

  const indexOfLastHoliday = currentHolidayPage * itemsPerPage;
  const indexOfFirstHoliday = indexOfLastHoliday - itemsPerPage;
  const currentHolidays = holidays.slice(
    indexOfFirstHoliday,
    indexOfLastHoliday
  );

  const handleHolidayPagination = (direction: "next" | "prev") => {
    setCurrentHolidayPage((prevPage) => {
      const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return newPage > 0 && newPage <= Math.ceil(holidays.length / itemsPerPage)
        ? newPage
        : prevPage;
    });
  };

  return (
    <div>
      <div className="">
        <div className="upper-container">
          <section className="dashboard-section">
            <h2>Holidays</h2>
            {role === "admin" && (
              <button
                onClick={() => setShowAddHolidayModal(true)}
                className="addholiday"
              >
                Add Holiday
              </button>
            )}
            {currentHolidays.length > 0 ? (
              <div className="card">
                {currentHolidays.map((holiday) => (
                  <div
                    key={holiday.id}
                    className="holiday-card"
                    style={{
                      backgroundImage: `url(${holiday.holiday_image})`,
                      backgroundRepeat: "no-repeat",
                      objectFit: "cover",
                      backgroundSize: "300px 200px",
                      color: "white",
                    }}
                  >
                    <h1>{holiday.name}</h1>
                    <p style={{ fontSize: "17px" }}>
                      {new Date(holiday.date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                      })}
                    </p>
                    {role === "admin" && (
                      <div className="holiday-actions">
                        <button
                          className="updateholiday"
                          onClick={() => {
                            setCurrentHoliday(holiday);
                            setNewHoliday({
                              name: holiday.name,
                              date: holiday.date,
                              holiday_image: null,
                            });
                            setShowUpdateHolidayModal(true);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className="deleteholiday"
                          onClick={() =>
                            window.confirm(
                              "Are you sure you want to delete this holiday?"
                            ) && handleDeleteHoliday(holiday)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="pagination">
                  <button
                    onClick={() => handleHolidayPagination("prev")}
                    disabled={currentHolidayPage === 1}
                    className="pagination-button"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => handleHolidayPagination("next")}
                    disabled={
                      currentHolidayPage ===
                      Math.ceil(holidays.length / itemsPerPage)
                    }
                    className="pagination-button"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            ) : (
              <p>No upcoming holidays.</p>
            )}
          </section>
        </div>
      </div>

      {showAddHolidayModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Holiday</h2>
            <form onSubmit={handleAddHoliday}>
              <label>
                Name:
                <input
                  type="text"
                  value={newHoliday.name}
                  required
                  onChange={(e) =>
                    setNewHoliday({ ...newHoliday, name: e.target.value })
                  }
                />
              </label>
              <label>
                Date:
                <input
                  type="date"
                  required
                  value={newHoliday.date}
                  onChange={(e) =>
                    setNewHoliday({ ...newHoliday, date: e.target.value })
                  }
                />
              </label>
              <label>
                Image:
                <input
                  type="file"
                  onChange={(e) =>
                    setNewHoliday({
                      ...newHoliday,
                      holiday_image: e.target.files ? e.target.files[0] : null,
                    })
                  }
                />
              </label>
              <div className="modal-buttons">
                <button
                  className="addholiday"
                  type="submit"
                >
                  Add
                </button>
                <button
                  className="cancel"
                  type="button"
                  onClick={() => setShowAddHolidayModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateHolidayModal && currentHoliday && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Holiday</h2>
            <form onSubmit={handleUpdateHoliday}>
              <label>
                Name:
                <input
                  type="text"
                  value={newHoliday.name}
                  required
                  onChange={(e) =>
                    setNewHoliday({ ...newHoliday, name: e.target.value })
                  }
                />
              </label>
              <label>
                Date:
                <input
                  type="date"
                  required
                  value={newHoliday.date}
                  onChange={(e) =>
                    setNewHoliday({ ...newHoliday, date: e.target.value })
                  }
                />
              </label>
              <label>
                Image:
                <input
                  type="file"
                  onChange={(e) =>
                    setNewHoliday({
                      ...newHoliday,
                      holiday_image: e.target.files ? e.target.files[0] : null,
                    })
                  }
                />
              </label>
              <div className="modal-buttons">
                <button
                  className="updateholiday"
                  type="submit"
                >
                  Update
                </button>
                <button
                  className="deleteholiday"
                  type="button"
                  onClick={() => setShowUpdateHolidayModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Holiday;
