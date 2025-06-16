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
import useAuth from '../../hooks/useAuth';
function ItemList() {
   useAuth();
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
    <div className="bg-white p-6 rounded shadow">
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
  {/* 🔍 Search Input */}
  <input
    type="text"
    placeholder="🔍 Search by name or description"
    onChange={(e) => handleSearchChange(e.target.value)}
    className="border border-gray-300 px-4 py-2 rounded w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* 📥 Download + ➕ Add Buttons */}
  <div className="flex gap-3 sm:ml-auto">
    {/* Dropdown Button Group */}
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
           onClick={() => generateItemReportPDF(items)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            📄 Download as PDF
          </button>
          <button
        onClick={() => exportItemReportExcel(items)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            📊 Download as Excel
          </button>
        </div>
      )}
    </div>

    {/* ➕ Add Item Button */}
    <button
      onClick={handleAddItemClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow transition text-sm"
    >
      ➕ Add Item
    </button>
  </div>
</div>

<AddItemModal isOpen={isModalOpen} onClose={handleModalClose} onSuccess={() => fetchItems()} />
      <DataTable
  columns={["#", "Name", "Description", "Qty", "Price (₹)"]}
     rows={items.map((item, index) => [
          (page - 1) * limit + index + 1,
          item.name,
          item.description,
          item.quantity,
          `₹${item.price.toFixed(2)}`,
        ])}
    renderActions={(_, index) => {
    // Get actual item object from original array
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(index)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(index)}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    );
  }}
/>
<DeleteModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={async () => {
    try {
      if (!selectedItem) return;
      await deleteItemById(selectedItem.id); 
      toast.success("Item deleted successfully");
      setShowModal(false);
      fetchItems(); // refresh list
    } catch {
      toast.error("Failed to delete item");
    }
  }}
  message={`Are you sure you want to delete "${selectedItem?.name}"?`}
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
      fetchItems(); // Refresh list
    } catch (error:unknown) {
        let msg = "Something went wrong";
    
    if (axios.isAxiosError(error) && error.response) {
      msg = error.response.data?.error || msg;
    }

    toast.error(`❌ ${msg}`);
      
    }
  }}
/>

<Pagination
  page={page}
  total={total}
  limit={limit}
  onPageChange={(newPage) => setPage(newPage)}
/>
    </div>
  )
}

export default ItemList
