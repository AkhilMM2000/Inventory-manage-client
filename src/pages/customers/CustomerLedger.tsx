import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCustomerLedger } from "../../api/Sales";
import type { Sale } from "../../types/Sales";
import type { Customer } from "../../types/Customer";
import toast from "react-hot-toast";
import DataTable from "../../components/table/DataTable";
import { generateCustomerLedgerPDF } from "../../utils/pdfUtils";
import { exportCustomerLedgerExcel } from "../../utils/excelUtils";

const CustomerLedger: React.FC = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalSales: 0,
    cashPaid: 0,
    creditOutstanding: 0,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        if (!id) return;

        const data = await getCustomerLedger(id);
        setCustomer(data.customer);
        setSales(data.sales);
        setSummary(data.summary);
      } catch {
        toast.error("Failed to load ledger");
      }
    };

    fetchLedger();
  }, [id]);

  if (!customer) return <div>Loading...</div>;

  const formatAddress = (c: Customer) => {
    const { line1, line2, city, district, state, postalCode, country } = c.address;
    const parts = [line1, line2, city, district, state, postalCode, country].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/customers" className="text-slate-400 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 6h10"/><path d="M8 10h10"/><path d="M8 14h10"/><path d="M8 18h10"/></svg>
              </span>
              Customer Ledger
            </h1>
          </div>
          <p className="text-slate-500 text-sm ml-8">Financial history for <span className="font-semibold text-slate-700">{customer.name}</span></p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Download Report
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-2 overflow-hidden">
                <button
                  onClick={() => { generateCustomerLedgerPDF(customer, sales, summary); setShowDropdown(false); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-600 transition-colors"
                >
                  <span className="text-red-500">PDF</span> Document
                </button>
                <button
                  onClick={() => { exportCustomerLedgerExcel(customer, sales, summary); setShowDropdown(false); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-600 transition-colors"
                >
                  <span className="text-emerald-500">Excel</span> Spreadsheet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: summary.totalOrders, color: "blue" },
          { label: "Total Sales", value: `₹${summary.totalSales.toLocaleString('en-IN')}`, color: "slate" },
          { label: "Amount Paid", value: `₹${summary.cashPaid.toLocaleString('en-IN')}`, color: "emerald" },
          { label: "Outstanding", value: `₹${summary.creditOutstanding.toLocaleString('en-IN')}`, color: "rose" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600">
              <p><span className="text-slate-400">Mobile:</span> {customer.mobile}</p>
              <p><span className="text-slate-400">Address:</span> {formatAddress(customer)}</p>
            </div>
          </div>
        </div>

        <DataTable
          columns={[
            { header: "#", className: "w-16" },
            { header: "Date", className: "w-32 font-mono text-xs" },
            { header: "Purchased Items", className: "max-w-md" },
            { header: "Total Value", className: "w-32 font-semibold" },
            { header: "Method", className: "w-28 text-center" }
          ]}
          rows={sales.map((sale, i) => [
            i + 1,
            new Date(sale.createdAt).toLocaleDateString("en-GB"),
            <div className="text-slate-600 text-sm leading-relaxed">
              {sale.items.map((item) => `${item.name} ×${item.quantity}`).join(", ")}
            </div>,
            <span className="text-slate-900">₹{sale.totalAmount.toLocaleString("en-IN")}</span>,
            <div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${
              sale.paymentType === 'Cash' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {sale.paymentType}
            </div>
          ])}
        />
      </div>
    </div>
  );

};

export default CustomerLedger;
