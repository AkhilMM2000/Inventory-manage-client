import React, { useState, useEffect, useCallback } from "react";
import { getSales } from "../../api/Sales"; 
import type { Sale } from "../../types/Sales"; 
import Pagination from "../../components/ui/pagination";
import debounce from "lodash/debounce";

import toast from "react-hot-toast";
import axios from "axios";
import SaleDetailsModal from "../../components/modals/SaleDetailsModal";
import DataTable from "../../components/table/DataTable";
import { generateSalesReportPDF } from "../../utils/pdfUtils";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const SalesList: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [paymentType, setPaymentType] = useState<"Cash" | "Credit" | "">("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
const navigate=useNavigate()
  const fetchSales = async () => {
    try {
      const result = await getSales(page, limit, search, paymentType || undefined);
      setSales(result.data);
      setTotal(result.total);
    } catch (error:unknown) {
         let msg = "Something went wrong";
    
    if (axios.isAxiosError(error) && error.response) {
      msg = error.response.data?.error || msg;
    }

    toast.error(`❌ ${msg}`);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [page, search, paymentType]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );
 const handleViewData= (index: number) => {
     const CurrentSale = sales[index];
  setSelectedSale(CurrentSale)
  };
  return (
  <div className="bg-white p-6 rounded shadow">
  {/* Header Row with Title, Filter, Download, and Add Sale */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
    <h2 className="text-xl font-semibold">📄 Sales History</h2>

    <div className="flex flex-wrap gap-3 items-center md:ml-auto">
      {/* 🔘 Filter by Payment */}
      <select
        value={paymentType}
        onChange={(e) => {
          setPaymentType(e.target.value as "Cash" | "Credit" | "");
          setPage(1);
        }}
        className="border px-3 py-2 rounded text-sm"
      >
        <option value="">All</option>
        <option value="Cash">Cash</option>
        <option value="Credit">Credit</option>
      </select>

      {/* 📥 Download PDF */}
      <button
        onClick={() => generateSalesReportPDF(sales)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        ⬇️ Download PDF
      </button>

      {/* ➕ Add Sale */}
      <button
        onClick={()=>navigate('/addsale')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        ➕ Add Sale
      </button>
    </div>
  </div>

  {/* 🔍 Search Input */}
  <input
    type="text"
    onChange={(e) => handleSearch(e.target.value)}
    placeholder="🔍 Search by customer name..."
    className="mb-4 w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
  />

 <DataTable
        columns={["#", "Date", "Customer", "Items","total","Payment"]}
        rows={sales.map((c, i) => [
          (page - 1) * limit + i + 1,
         moment(c.createdAt).format("dddd, MMMM YYYY"),
          c.customerName,
          c.items.length,
          c.totalAmount,
          c.paymentType
        ])}
        renderActions={(_, index) => (
          <div className="flex gap-2">
            <button onClick={() => handleViewData(index)} className="text-blue-600 hover:underline">View</button>
            
          </div>
        )}
      />
    

      <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />

      <SaleDetailsModal
        sale={selectedSale}
        onClose={() => setSelectedSale(null)}
        show={!!selectedSale}
      />
    </div>
  );
};

export default SalesList;
