import * as XLSX from 'xlsx';
import type { Customer } from '../types/Customer';
import type { Sale } from '../types/Sales';
import type { Item } from '../types/Item';
export const exportCustomerLedgerExcel = (
  customer: Customer,
  sales: Sale[],
  summary: {
    totalOrders: number;
    totalSales: number;
    cashPaid: number;
    creditOutstanding: number;
  }
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = [];

  // Header
  data.push([`Customer Ledger – ${customer.name}`, "", "", "", ""]);
  data.push([`Mobile: ${customer.mobile}`, "", "", `Address: ${customer.address}`, ""]);
  data.push([]); // empty row

  // Table headers
  data.push(["#", "Date", "Items Sold", "Total (₹)", "Payment"]);

  // Table data
  sales.forEach((sale, index) => {
    const itemSummary = sale.items.map((i) => `${i.name} ×${i.quantity}`).join(", ");
    data.push([
      index + 1,
      new Date(sale.createdAt).toLocaleDateString("en-GB"),
      itemSummary,
      sale.totalAmount,
      sale.paymentType,
    ]);
  });

  data.push([]); // spacer row

  // Summary block (match columns)
  data.push(["Total Orders", summary.totalOrders, "", "", ""]);
  data.push(["Total Sales", `₹${summary.totalSales}`, "", "", ""]);
  data.push(["Cash Paid", `₹${summary.cashPaid}`, "", "", ""]);
  data.push(["Credit Outstanding", `₹${summary.creditOutstanding}`, "", "", ""]);

  // Create sheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // ✅ Set consistent column widths
  worksheet["!cols"] = [
    { wch: 5 },   // #
    { wch: 15 },  // Date
    { wch: 50 },  // Items Sold
    { wch: 15 },  // Total
    { wch: 15 },  // Payment
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");

  const filename = `Ledger_${customer.name.replace(/\s+/g, "_")}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
export const exportItemReportExcel = (items: Item[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = [];

  // Title
  data.push(["Inventory Report"]);
  data.push([]);
  
  // Headers
  data.push(["#", "Name", "Description", "Quantity", "Price (₹)", "Total Value (₹)"]);

  // Item rows
  items.forEach((item, index) => {
    data.push([
      index + 1,
      item.name,
      item.description,
      item.quantity,
      item.price,
      item.quantity * item.price,
    ]);
  });

  // Add empty spacer row
  data.push([]);

  // Summary block
  const totalItems = items.length;
  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  data.push(["Total Items", totalItems, "", "", "", ""]);
  data.push(["Total Units", totalUnits, "", "", "", ""]);
  data.push(["Total Stock Value", `₹${totalValue}`, "", "", "", ""]);

  // Create sheet and set column widths
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  worksheet["!cols"] = [
    { wch: 5 },    // #
    { wch: 20 },   // Name
    { wch: 40 },   // Description
    { wch: 12 },   // Quantity
    { wch: 15 },   // Price
    { wch: 20 },   // Total
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

  const today = new Date().toISOString().slice(0, 10);
  const filename = `Inventory_Report_${today}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

export const generateSalesReportExcel = (sales: Sale[]) => {
  // Format currency (reuse from PDF function)
  const formatCurrency = (amount: number) =>
    `RS: ${amount.toLocaleString("en-IN")}`;

  // Table Data (reuse from PDF function)
  const tableData = sales.map((sale, index) => {
    const itemSummary = sale.items
      .map((i) => `${i.name} ×${i.quantity}`)
      .join(", ");

    return [
      index + 1,
      new Date(sale.createdAt).toLocaleDateString("en-GB"),
      sale.customerName,
      itemSummary,
      formatCurrency(sale.totalAmount),
      sale.paymentType
    ];
  });

  // Summary (reuse from PDF function)
  const summary = {
    totalOrders: sales.length,
    totalAmount: sales.reduce((sum, s) => sum + s.totalAmount, 0),
    cashSales: sales
      .filter((s) => s.paymentType === "Cash")
      .reduce((sum, s) => sum + s.totalAmount, 0),
    creditSales: sales
      .filter((s) => s.paymentType === "Credit")
      .reduce((sum, s) => sum + s.totalAmount, 0),
  };

  // Prepare Excel data as Array of Arrays (AoA)
  const data = [
    ["Sales Report"],  // Title row
    [],  // Empty row for spacing
    ["#", "Date", "Customer", "Items Sold", "Total ₹", "Payment"],  // Headers
    ...tableData,  // Table rows
    [],  // Empty row for spacing
    ["Summary"],  // Summary section
    ["Total Orders", summary.totalOrders],
    ["Total Sales", formatCurrency(summary.totalAmount)],
    ["Cash Sales", formatCurrency(summary.cashSales)],
    ["Credit Sales", formatCurrency(summary.creditSales)],
  ];

  // Create worksheet from data
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Create workbook and append sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

  // Generate filename and save
  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Sales_Report_${today}.xlsx`);
};