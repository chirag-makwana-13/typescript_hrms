import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import "./Dashboard.css";

// Define types for the birthday data
interface BirthdayType {
  id: number;
  first_name: string;
  last_name: string;
  dob: string; // Date of birth as a string in ISO format or similar
}

const Birthday: React.FC = () => {
  const [birthdays, setBirthdays] = useState<BirthdayType[]>([]);
  const [currentBirthdayPage, setCurrentBirthdayPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<BirthdayType[]>("/birthdays/");
        setBirthdays(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error appropriately if needed
      }
    };

    fetchData();
  }, []);

  const indexOfLastBirthday = currentBirthdayPage * itemsPerPage;
  const indexOfFirstBirthday = indexOfLastBirthday - itemsPerPage;
  const currentBirthday = birthdays.slice(
    indexOfFirstBirthday,
    indexOfLastBirthday
  );

  const handleBirthdayPagination = (direction: "next" | "prev") => {
    setCurrentBirthdayPage((prevPage) => {
      const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
      return newPage > 0 &&
        newPage <= Math.ceil(birthdays.length / itemsPerPage)
        ? newPage
        : prevPage;
    });
  };

  return (
    <div>
      <div className="">
        <div className="upper-container">
          <section className="dashboard-section">
            <h2>Upcoming Birthday</h2>
            {currentBirthday.length > 0 ? (
              <div className="card">
                {currentBirthday.map((birthday) => (
                  <div key={birthday.id} className="birthday-card">
                    <h3>
                      {birthday.first_name} {birthday.last_name}
                    </h3>
                    <p style={{ fontSize: "17px" }}>
                      {new Date(birthday.dob).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                      })}
                    </p>
                  </div>
                ))}
                <div className="pagination">
                  <button
                    onClick={() => handleBirthdayPagination("prev")}
                    disabled={currentBirthdayPage === 1}
                    className="pagination-button"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={() => handleBirthdayPagination("next")}
                    disabled={
                      currentBirthdayPage ===
                      Math.ceil(birthdays.length / itemsPerPage)
                    }
                    className="pagination-button"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            ) : (
              <p>No upcoming birthdays.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Birthday;
