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
import { generateSalesReportExcel } from "../../utils/excelUtils";


const SalesList: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [paymentType, setPaymentType] = useState<"Cash" | "Credit" | "">("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
 
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);  // Add this for Excel loading state

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

  const fetchAllSalesForReport = async () => {
    const DOWNLOAD_PAGE_SIZE = 1000;
    const firstPage = await getSales(
      1,
      DOWNLOAD_PAGE_SIZE,
      search,
      paymentType || undefined
    );

    const totalPages = Math.ceil(firstPage.total / DOWNLOAD_PAGE_SIZE);
    if (totalPages <= 1) return firstPage.data;

    const pagePromises: Promise<typeof firstPage>[] = [];
    for (let p = 2; p <= totalPages; p += 1) {
      pagePromises.push(
        getSales(p, DOWNLOAD_PAGE_SIZE, search, paymentType || undefined)
      );
    }

    const restPages = await Promise.all(pagePromises);
    return [firstPage.data, ...restPages.map((r) => r.data)].flat();
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const allSales = await fetchAllSalesForReport();
      generateSalesReportPDF(allSales);
    } catch (error: unknown) {
      let msg = "Failed to download report";

      if (axios.isAxiosError(error) && error.response) {
        msg = error.response.data?.error || msg;
      }

      toast.error(`âŒ ${msg}`);
    } finally {
      setIsDownloading(false);
    }
  };
   const handleDownloadExcel = async () => {
    try {
      setIsDownloadingExcel(true);
      const allSales = await fetchAllSalesForReport();
      generateSalesReportExcel(allSales);
    } catch (error: unknown) {
      let msg = "Failed to download Excel report";

      if (axios.isAxiosError(error) && error.response) {
        msg = error.response.data?.error || msg;
      }

      toast.error(`❌ ${msg}`);
    } finally {
      setIsDownloadingExcel(false);
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
        onClick={handleDownloadPdf}
        disabled={isDownloading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm disabled:opacity-60"
      >
        {isDownloading ? "Generating..." : "⬇️ Download PDF"}
      </button>

      {/* ➕ Add Sale */}
      <button
        onClick={()=>navigate('/addsale')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        ➕ Add Sale
      </button>
      <button
            onClick={handleDownloadExcel}
            disabled={isDownloadingExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm disabled:opacity-60"
          >
            {isDownloadingExcel ? "Generating..." : "📊 Download Excel"}
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
         c.createdAt.split("T")[0],
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
