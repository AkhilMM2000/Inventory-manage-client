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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 transition-all scale-100">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </span>
              Sale Transaction Details
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-mono uppercase tracking-widest">ID: {sale.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Name</p>
              <p className="text-slate-800 font-semibold">{sale.customerName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction Date</p>
              <p className="text-slate-800 font-semibold">{new Date(sale.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Method</p>
              <div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold ${
                sale.paymentType === 'Cash' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {sale.paymentType}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <DataTable
              columns={[
                { header: "Item Name", className: "font-medium text-slate-700" },
                { header: "Qty", className: "w-16 text-center" },
                { header: "Unit Price", className: "w-28" },
                { header: "Subtotal", className: "w-28 font-bold text-slate-900" }
              ]}
              rows={sale.items.map((item) => [
                item.name,
                <span className="bg-slate-50 px-2 py-1 rounded text-xs text-slate-500">{item.quantity}</span>,
                `₹${item.unitPrice.toLocaleString('en-IN')}`,
                `₹${(item.quantity * item.unitPrice).toLocaleString('en-IN')}`,
              ])}
            />
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 flex justify-between items-center text-white">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Billable Amount</p>
              <p className="text-xs text-slate-500 italic">Inclusive of all applicable taxes</p>
            </div>
            <p className="text-3xl font-black tabular-nums">
              ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );

};

export default SaleDetailsModal;
