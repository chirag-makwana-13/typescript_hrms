import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <div className="pagination">
      <button
        onClick={handleFirstPage}
        className="pagination-button"
        disabled={currentPage === 1}
      >
        <span aria-hidden="true">&laquo;</span>
      </button>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        <span aria-hidden="true">&lang;</span>
      </button>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        <span aria-hidden="true">&rang;</span>
      </button>
      <button
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        <span aria-hidden="true">&raquo;</span>
      </button>
    </div>
  );
};

export default Pagination;
