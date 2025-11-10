import React from "react";
import "../componentStyles/Pagination.css";
import { useSelector } from "react-redux";
const Pagination = ({
  currentPage,
  onPageChange,
  activeClass = "active",
  previousPageText = "Prev",
  nextPageText = "Next",
  fistPageText = "1st",
  lastPageText = "Last",
}) => {
  const { totalPages, products } = useSelector((state) => state.product);
  if (products.length === 0 && totalPages <= 1) return null;

  // Generate page numbers

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const pageWindow = 2;

    for (
      let i = Math.max(1, currentPage - pageWindow);
      i <= Math.min(totalPages, currentPage + pageWindow);
      i++
    ) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="pagination">
        {/* 1st and previous page button */}

        {currentPage > 1 && (
          <>
            <button className="pagination-btn" onClick={()=>onPageChange(1)}>
              {fistPageText}
            </button>
            <button
              className="pagination-btn"
              onClick={()=>onPageChange(currentPage - 1)}
            >
              {previousPageText}
            </button>
          </>
        )}

        {/* Dynamic generated pages */}

        {generatePageNumbers().map((number) => (
          <button
            className={`pagination-btn ${
              currentPage === number ? activeClass : ""
            }`}
            key={number}
            onClick={()=>onPageChange(number)}
          >
            {number}
          </button>
        ))}

        {/* next page and last page button  */}
        {currentPage < totalPages && (
          <>
            <button
              className="pagination-btn"
              onClick={()=>onPageChange(currentPage + 1)}
            >
              {nextPageText}
            </button>
            <button
              className="pagination-btn"
              onClick={()=>onPageChange(totalPages)}
            >
              {lastPageText}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Pagination;
