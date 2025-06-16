import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCustomerLedger } from "../../api/Sales";
import type { Sale } from "../../types/Sales";
import type { Customer } from "../../types/Customer"; 
import toast from "react-hot-toast";
import DataTable from "../../components/table/DataTable";
import {  generateCustomerLedgerPDF } from "../../utils/pdfUtils";
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

  return (
    <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📓 Customer Ledger</h2>
        
        <Link to="/customers">
          <button className="text-blue-600 underline">← Back to Customers</button>
        </Link>
        <div className="relative" ref={dropdownRef}>
  <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    ⬇️ Download Report
  </button>

  {showDropdown && (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
      <button
         onClick={() => generateCustomerLedgerPDF(customer, sales, summary)}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
      >
        📄 Download as PDF
      </button>
      <button
           onClick={() => exportCustomerLedgerExcel(customer, sales, summary)}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
      >
        📊 Download as Excel
      </button>
    </div>
  )}
</div>

      </div>

      <div className="mb-4 text-sm">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Mobile:</strong> {customer.mobile}</p>
        <p><strong>Address:</strong> {customer.address}</p>
      </div>

      <DataTable
  columns={["#", "Date", "Items", "Total", "Payment"]}
  rows={sales.map((c, i) => [
    i + 1, // This is your "#" column
    new Date(c.createdAt).toLocaleDateString("en-GB"), // Format date
    c.items.map((item) => `${item.name} ×${item.quantity}`).join(", "),
    `INR ${c.totalAmount.toLocaleString("en-IN")}`,
    c.paymentType
  ])}
/>

      <div className="text-sm border-t pt-4 space-y-1">
        <p><strong>Total Orders:</strong> {summary.totalOrders}</p>
        <p><strong>Total Sales:</strong> ₹{summary.totalSales}</p>
        <p><strong>Cash Paid:</strong> ₹{summary.cashPaid}</p>
        <p><strong>Credit Outstanding:</strong> ₹{summary.creditOutstanding}</p>
      </div>
    </div>
  );
};

export default CustomerLedger;
