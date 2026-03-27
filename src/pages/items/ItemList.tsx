import  { useCallback, useEffect, useRef, useState } from 'react'
import DataTable from '../../components/table/DataTable'
import type { Item } from '../../types/Item';
import toast from 'react-hot-toast';
import axios from 'axios';
import { deleteItemById, getItems, updateItemById } from '../../api/item';
import Pagination from '../../components/ui/pagination';
import DeleteModal from '../../components/ui/DeleteModal';
import EditItemModal from '../../components/modals/EditModal';
import debounce from "lodash/debounce";

import AddItemModal from '../../components/modals/AddItemModal';
import { generateItemReportPDF } from '../../utils/pdfUtils';
import { exportItemReportExcel } from '../../utils/excelUtils';

function ItemList() {
      const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // You can make this dynamic
  const [total, setTotal] = useState(0);
 const [showModal, setShowModal] = useState(false);
 
const [selectedItem, setSelectedItem] = useState<Item | null>(null);
const [showEditModal, setShowEditModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddItemClick = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
const [search, setSearch] = useState("");


    const fetchItems = async () => {
    try {
      const result = await getItems(page, limit,search);
      console.log(result,'data fetch from backened')
      setItems(result.data);
      setTotal(result.total);
    } catch (error: unknown) {
       let msg = "Something went wrong";
    
    if (axios.isAxiosError(error) && error.response) {
      msg = error.response.data?.error || msg;
    }

    toast.error(`❌ ${msg}`);
    }
  };
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
    fetchItems();
  }, [page,search]);
const handleEdit=(index:number)=>{
  setSelectedItem(items[index]);
  setShowEditModal(true);
}
const handleDelete=(index:number)=>{
setSelectedItem(items[index]);
  setShowModal(true);
}
// eslint-disable-next-line react-hooks/exhaustive-deps
const handleSearchChange = useCallback(
  debounce((value: string) => {
    setSearch(value);
    setPage(1); 
  }, 500),
  []
);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </span>
            Inventory Items
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your stock levels and product details</p>
        </div>
        <div className="flex gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-2 overflow-hidden">
                <button
                  onClick={() => { generateItemReportPDF(items); setShowDropdown(false); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-600 transition-colors"
                >
                  <span className="text-red-500">PDF</span> Document
                </button>
                <button
                  onClick={() => { exportItemReportExcel(items); setShowDropdown(false); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-600 transition-colors"
                >
                  <span className="text-emerald-500">Excel</span> Spreadsheet
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleAddItemClick}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
          >
            <span className="text-lg">+</span> Add Item
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6 relative">
          <input
            type="text"
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products by name or description..."
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <AddItemModal isOpen={isModalOpen} onClose={handleModalClose} onSuccess={() => fetchItems()} />
        
        <DataTable
          columns={[
            { header: "#", className: "w-16" },
            { header: "Product Details", className: "font-medium text-slate-900" },
            { header: "Description", className: "max-w-xs" },
            { header: "Stock", className: "w-32" },
            { header: "Unit Price", className: "w-32" }
          ]}
          rows={items.map((item, index) => [
            (page - 1) * limit + index + 1,
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800">{item.name}</span>
              <span className="text-xs text-slate-400">ID: {item.id.slice(0, 8)}...</span>
            </div>,
            <div className="text-slate-500 text-sm line-clamp-2">
              {item.description || <span className="italic text-slate-300">No description</span>}
            </div>,
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${item.quantity > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="font-medium text-slate-700">{item.quantity}</span>
            </div>,
            <span className="font-semibold text-slate-900">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>,
          ])}
          renderActions={(_, index) => (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleEdit(index)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Edit Item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
              </button>
            </div>
          )}
        />

        <div className="mt-8 border-t border-slate-50 pt-6">
          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>

      <DeleteModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={async () => {
          try {
            if (!selectedItem) return;
            await deleteItemById(selectedItem.id); 
            toast.success("Item deleted successfully");
            setShowModal(false);
            fetchItems();
          } catch {
            toast.error("Failed to delete item");
          }
        }}
        message={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
      />
      
      <EditItemModal
        show={showEditModal}
        item={selectedItem}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        onUpdate={async (updatedItem) => {
          try {
            await updateItemById(updatedItem.id!, updatedItem);
            toast.success("Item updated successfully");
            setShowEditModal(false);
            setSelectedItem(null);
            fetchItems();
          } catch (error:unknown) {
            let msg = "Something went wrong";
            if (axios.isAxiosError(error) && error.response) {
              msg = error.response.data?.error || msg;
            }
            toast.error(`❌ ${msg}`);
          }
        }}
      />
    </div>
  );
}

export default ItemList;
