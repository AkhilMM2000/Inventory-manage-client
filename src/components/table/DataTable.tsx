import React from "react";

interface DataTableProps {
  columns: string[];
  rows: (string | number | React.ReactNode)[][];
  renderActions?: (row: (string | number | React.ReactNode)[], rowIndex: number) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ columns, rows, renderActions }) => {
  const totalCols = renderActions ? columns.length + 1 : columns.length;

  return (
    <div className="w-full bg-white shadow rounded-md overflow-x-auto">
      {/* Header */}
      <div className="grid grid-cols-12 bg-gray-100 font-semibold p-3 border-b">
        {columns.map((col, index) => (
          <div key={index} className={`col-span-${12 / totalCols} truncate`}>
            {col}
          </div>
        ))}
        {renderActions && (
          <div className={`col-span-${12 / totalCols} truncate`}>Actions</div>
        )}
      </div>

      {/* Rows */}
      {rows.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No data available</div>
      ) : (
        rows.map((row, i) => (
          <div key={i} className="grid grid-cols-12 p-3 border-b hover:bg-gray-50 text-sm">
            {row.map((cell, j) => (
              <div key={j} className={`col-span-${12 / totalCols} truncate`}>
                {cell}
              </div>
            ))}
            {renderActions && (
              <div className={`col-span-${12 / totalCols} flex justify-start`}>
                {renderActions(row, i)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DataTable;
