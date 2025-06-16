import React from "react";

interface DataTableProps {
  columns: string[];
  rows: (string | number | React.ReactNode)[][];
  renderActions?: (row: (string | number | React.ReactNode)[], rowIndex: number) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ columns, rows, renderActions }) => {
 

  return (
    <div className="w-full bg-white shadow rounded-md overflow-x-auto">
      {/* Header */}
      <div className="flex w-full bg-gray-100 font-semibold text-sm border-b">
        {columns.map((col, index) => (
          <div
            key={index}
            className="flex-1 px-4 py-3 min-w-[120px] truncate"
          >
            {col}
          </div>
        ))}
        {renderActions && (
          <div className="w-[120px] px-4 py-3 truncate">Action</div>
        )}
      </div>

      {/* Rows */}
      {rows.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No data available</div>
      ) : (
        rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex w-full text-sm border-b hover:bg-gray-50">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="flex-1 px-4 py-3 min-w-[120px] truncate"
              >
                {cell}
              </div>
            ))}
            {renderActions && (
              <div className="w-[120px] px-4 py-3">
                {renderActions(row, rowIndex)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};


export default DataTable;
