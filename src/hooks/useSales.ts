import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import { getSales } from "../api/Sales";
import { generateSalesReportPDF } from "../utils/pdfUtils";
import { generateSalesReportExcel } from "../utils/excelUtils";
import type { Sale } from "../types/Sales";

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [paymentType, setPaymentType] = useState<"Cash" | "Credit" | "">("");
  const [loading, setLoading] = useState(false);
  
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getSales(page, limit, search, paymentType || undefined);
      setSales(result.data);
      setTotal(result.total);
    } catch (error: unknown) {
      let msg = "Something went wrong";
      if (axios.isAxiosError(error) && error.response) {
        msg = error.response.data?.error || msg;
      }
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, paymentType]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

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

    const pagePromises: Promise<any>[] = [];
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
      toast.error("Failed to download PDF report");
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
      toast.error("Failed to download Excel report");
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const handleViewDetails = (index: number) => {
    setSelectedSale(sales[index]);
  };

  return {
    sales,
    page,
    setPage,
    limit,
    total,
    loading,
    search,
    handleSearch,
    paymentType,
    setPaymentType,
    selectedSale,
    setSelectedSale,
    isDownloading,
    isDownloadingExcel,
    handleDownloadPdf,
    handleDownloadExcel,
    handleViewDetails,
    refreshSales: fetchSales,
  };
};
