import React from "react";

interface ColumnConfig {
  header: string;
  className?: string;
}

interface DataTableProps {
  columns: (string | ColumnConfig)[];
  rows: (React.ReactNode)[][];
  renderActions?: (row: React.ReactNode[], rowIndex: number) => React.ReactNode;
}

const DataTable: React.FC<DataTableProps> = ({ columns, rows, renderActions }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-200">
            {columns.map((col, index) => {
              const header = typeof col === "string" ? col : col.header;
              const className = typeof col === "string" ? "" : col.className;
              return (
                <th
                  key={index}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap ${className}`}
                >
                  {header}
                </th>
              );
            })}
            {renderActions && (
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="px-6 py-12 text-center text-slate-500 italic"
              >
                No data available
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-slate-50/80 transition-colors duration-150 group"
              >
                {row.map((cell, cellIndex) => {
                  const className = typeof columns[cellIndex] === "object" ? (columns[cellIndex] as ColumnConfig).className : "";
                  return (
                    <td
                      key={cellIndex}
                      className={`px-6 py-4 text-sm text-slate-600 align-top ${className}`}
                    >
                      {cell}
                    </td>
                  );
                })}
                {renderActions && (
                  <td className="px-6 py-4 text-sm text-right align-top">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {renderActions(row, rowIndex)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

