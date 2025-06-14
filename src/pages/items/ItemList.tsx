import  { useCallback, useEffect, useState } from 'react'
import DataTable from '../../components/table/DataTable'
import type { Item } from '../../types/Item';
import toast from 'react-hot-toast';
import axios from 'axios';
import { deleteItemById, getItems, updateItemById } from '../../api/item';
import Pagination from '../../components/ui/pagination';
import DeleteModal from '../../components/ui/DeleteModal';
import EditItemModal from '../../components/modals/EditModal';
import debounce from "lodash/debounce";
function ItemList() {
      const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // You can make this dynamic
  const [total, setTotal] = useState(0);
 const [showModal, setShowModal] = useState(false);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);
const [showEditModal, setShowEditModal] = useState(false);
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
    <div>
        <input
  type="text"
  placeholder="Search by name or description"
  onChange={(e) => handleSearchChange(e.target.value)}
  className="mb-4 w-full border p-2 rounded"
/>

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
