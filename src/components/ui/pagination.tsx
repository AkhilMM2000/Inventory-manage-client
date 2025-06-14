import React from "react";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, total, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate start and end of the range
    const start = Math.max(2, page - delta);
    const end = Math.min(totalPages - 1, page + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page
    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add pages in range (but not first or last)
    rangeWithDots.push(...range.filter(p => p !== 1 && p !== totalPages));

    // Add last page
    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 mt-8 px-2">
     

      {/* Pagination controls */}
      <div className="order-2 flex items-center gap-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="group relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
                     bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                     focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800
                     transition-all duration-200 ease-in-out"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers - hidden on mobile, shown on tablet+ */}
        <div className="hidden md:flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <span className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(pageNum as number)}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
                             transition-all duration-200 ease-in-out focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                             ${
                               page === pageNum
                                 ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
                                 : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                             }`}
                >
                  {pageNum}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile page indicator */}
        <div className="md:hidden flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {page} / {totalPages}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="group relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
                     bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                     text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                     focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800
                     transition-all duration-200 ease-in-out"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;