import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import type { Sale } from '../types/Sales'; // adjust as per your project structure
import type { Customer } from '../types/Customer';
import type { Item } from '../types/Item';
  // adjust as per your project structure

export const generateSalesReportPDF = (sales: Sale[]) => {
  const doc = new jsPDF();

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Sales Report", 14, 20);

  // Format currency
  const formatCurrency = (amount: number) =>
    `RS: ${amount.toLocaleString("en-IN")}`;

  // Table Data
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

  // Summary
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

  // Sales Table
  autoTable(doc, {
    startY: 30,
    head: [["#", "Date", "Customer", "Items Sold", "Total ₹", "Payment"]],
    body: tableData,
    styles: { fontSize: 10, halign: "center" },
    headStyles: {
      fillColor: [41, 128, 185],
      halign: "center",
      textColor: 255
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 60 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 }
    }
  });

  // Get Y position after table
  type JsPDFWithAutoTable = jsPDF & { lastAutoTable?: { finalY?: number } };
  const docWithAutoTable = doc as JsPDFWithAutoTable;
  const finalY = docWithAutoTable.lastAutoTable?.finalY || 30;

  // Summary Text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Total Orders: ${summary.totalOrders}`, 14, finalY + 10);
  doc.text(`Total Sales: ${formatCurrency(summary.totalAmount)}`, 14, finalY + 18);
  doc.text(`Cash Sales: ${formatCurrency(summary.cashSales)}`, 14, finalY + 26);
  doc.text(`Credit Sales: ${formatCurrency(summary.creditSales)}`, 14, finalY + 34);

  // Save
  const today = new Date().toISOString().slice(0, 10);
  doc.save(`Sales_Report_${today}.pdf`);
};

export const generateCustomerLedgerPDF = (
  customer: Customer,
  sales: Sale[],
  summary: {
    totalOrders: number;
    totalSales: number;
    cashPaid: number;
    creditOutstanding: number;
  }
) => {
  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Customer Ledger – ${customer.name}`, 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Mobile: ${customer.mobile}`, 14, 28);
  doc.text(`Address: ${customer.address}`, 14, 34);

  // Table
  const tableData = sales.map((sale, index) => [
    index + 1,
    new Date(sale.createdAt).toLocaleDateString("en-GB"),
    sale.items.map((i) => `${i.name} ×${i.quantity}`).join(", "),
    `₹${sale.totalAmount}`,
    sale.paymentType,
  ]);

  autoTable(doc, {
    startY: 42,
    head: [["#", "Date", "Items", "Total (RS)", "Payment"]],
    body: tableData,
    styles: { fontSize: 9, halign: "center" },
    headStyles: { fillColor: [51, 102, 204], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 80 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
    },
  });

type JsPDFWithAutoTable = jsPDF & { lastAutoTable?: { finalY?: number } };
  const docWithAutoTable = doc as JsPDFWithAutoTable;
  const finalY = docWithAutoTable.lastAutoTable?.finalY || 30;

  // Summary Section
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Orders: ${summary.totalOrders}`, 14, finalY + 10);
  doc.text(`Total Sales: RS:${summary.totalSales}`, 14, finalY + 18);
  doc.text(`Cash Paid: RS:${summary.cashPaid}`, 14, finalY + 26);
  doc.text(`Credit Outstanding: RS:${summary.creditOutstanding}`, 14, finalY + 34);

  // Save
  const today = new Date().toISOString().slice(0, 10);
  const filename = `Ledger_${customer.name.replace(/\s+/g, "_")}_${today}.pdf`;
  doc.save(filename);
};



export const generateItemReportPDF = (items: Item[]) => {
  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("📦 Inventory Report", 14, 20);

  // Prepare table data
  const tableData = items.map((item, index) => [
    index + 1,
    item.name,
    item.description,
    item.quantity,
    `₹${item.price}`,
    `₹${item.quantity * item.price}`,
  ]);

  // Add table
  autoTable(doc, {
    startY: 30,
    head: [["#", "Name", "Description", "Quantity", "Price", "Total Value"]],
    body: tableData,
    styles: { fontSize: 10, halign: "center" },
    headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 30 },
      2: { cellWidth: 50 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 30 },
    },
  });

  // Summary
  const totalItems = items.length;
  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  type JsPDFWithAutoTable = jsPDF & { lastAutoTable?: { finalY?: number } };
  const docWithAutoTable = doc as JsPDFWithAutoTable;
  const finalY = docWithAutoTable.lastAutoTable?.finalY || 40;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Items: ${totalItems}`, 14, finalY + 10);
  doc.text(`Total Units: ${totalUnits}`, 14, finalY + 18);
  doc.text(`Total Stock Value: RS:${totalValue}`, 14, finalY + 26);

  // Save
  const today = new Date().toISOString().slice(0, 10);
  doc.save(`Inventory_Report_${today}.pdf`);
};