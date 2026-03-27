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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </span>
            Sales History
          </h1>
          <p className="text-slate-500 text-sm mt-1">Review and manage your transaction records</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={paymentType}
            onChange={(e) => {
              setPaymentType(e.target.value as "Cash" | "Credit" | "");
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          >
            <option value="">All Payments</option>
            <option value="Cash">Cash Only</option>
            <option value="Credit">Credit Only</option>
          </select>

          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white hover:shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <span className="text-red-500">PDF</span>
              {isDownloading ? "..." : "Export"}
            </button>
            <button
              onClick={handleDownloadExcel}
              disabled={isDownloadingExcel}
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white hover:shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <span className="text-emerald-600">Excel</span>
              {isDownloadingExcel ? "..." : "Export"}
            </button>
          </div>

          <button
            onClick={() => navigate('/addsale')}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
          >
            <span className="text-lg">+</span> New Sale
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6 relative">
          <input
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by customer name..."
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <DataTable
          columns={[
            { header: "#", className: "w-16" },
            { header: "Date", className: "w-32 font-mono text-xs" },
            { header: "Customer Name", className: "font-medium text-slate-900" },
            { header: "Items Count", className: "w-32 text-center" },
            { header: "Total Amount", className: "w-40 font-semibold" },
            { header: "Payment Status", className: "w-40" }
          ]}
          rows={sales.map((sale, i) => [
            (page - 1) * limit + i + 1,
            new Date(sale.createdAt).toLocaleDateString('en-GB'),
            sale.customerName,
            <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600">
              {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
            </span>,
            <span className="text-slate-900">₹{sale.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>,
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              sale.paymentType === 'Cash' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {sale.paymentType}
            </div>
          ])}
          renderActions={(_, index) => (
            <button
              onClick={() => handleViewData(index)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="View Sale Details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          )}
        />

        <div className="mt-8 border-t border-slate-50 pt-6">
          <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
        </div>
      </div>

      <SaleDetailsModal
        sale={selectedSale}
        onClose={() => setSelectedSale(null)}
        show={!!selectedSale}
      />
    </div>
  );

};

export default SalesList;
