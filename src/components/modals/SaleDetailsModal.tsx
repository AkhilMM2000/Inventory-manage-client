import React from "react";
import type { Sale } from "../../types/Sales"; 
import DataTable from "../table/DataTable";

interface SaleDetailsModalProps {
  show: boolean;
  sale: Sale | null;
  onClose: () => void;
}

const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({ show, sale, onClose }) => {
  if (!show || !sale) return null;

  const total = sale.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-2">🧾 Sale Details</h2>

        <div className="mb-4 text-sm">
          <p><strong>Date:</strong> {new Date(sale.createdAt).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> {sale.customerName}</p>
          <p><strong>Payment:</strong> {sale.paymentType}</p>
        </div>

       
 <DataTable
        columns={[ "Item", "Quantity", "Unit","subtotal"]}
        rows={sale.items.map((c) => [
         
         c.name,
          c.quantity,
          c.unitPrice.toFixed(2),
        c.quantity * c.unitPrice,
         
        ])}
       
      />
        <p className="text-right font-semibold">Total: ₹{total}</p>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailsModal;
