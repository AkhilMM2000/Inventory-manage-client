import  { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { getCustomers, deleteCustomer, updateCustomer, addCustomer } from "../../api/customer";
import type { Customer, CustomerFormData } from "../../types/Customer"; 
import DataTable from "../../components/table/DataTable";
import Pagination from "../../components/ui/pagination"; 
import DeleteModal from "../../components/ui/DeleteModal";
import toast from "react-hot-toast";
import axios from "axios";
import CustomerModal from "../../components/modals/CustomerModal";
import { Link } from "react-router-dom";
import { BookOpen, Pencil, Trash2 } from "lucide-react";

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
const [showCustomerModal, setShowCustomerModal] = useState(false);
const [editCustomerData, setEditCustomerData] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      const result = await getCustomers(page, limit, search);
      setCustomers(result.data);
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
    fetchCustomers();
  }, [page, search]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  const handleDeleteClick = (index: number) => {
    setSelectedCustomer(customers[index]);
    setShowDeleteModal(true);
  };

  const handleEditClick = (index: number) => {
     const customer = customers[index];
  setEditCustomerData(customer); // pass data to modal
  setShowCustomerModal(true);
  };
const handleAddCustomer = () => {
  setEditCustomerData(null); // clear for add mode
  setShowCustomerModal(true);
};
const handleCustomerSubmit = async (form: CustomerFormData) => {
  try {
    if (editCustomerData) {
      await updateCustomer(editCustomerData.id, form);
      toast.success("Customer updated");
    } else {
      await addCustomer(form);
      toast.success("Customer added");
    }

    setShowCustomerModal(false);
    setEditCustomerData(null);
    fetchCustomers();
  } catch {
    toast.error("Failed to save customer");
  }
};

  return (
    <div className="bg-white p-6 rounded shadow">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">👥 Customer List</h2>
    <button
      onClick={handleAddCustomer}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      ➕ Add Customer
    </button>
  </div>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by name or address"
        className="mb-4 w-full border p-2 rounded"
      />

      <DataTable
        columns={["#", "Name", "Address", "Mobile"]}
        rows={customers.map((c, i) => [
          (page - 1) * limit + i + 1,
          c.name,
          c.address,
          c.mobile,
        ])}
   renderActions={(_, index) => {
  const customer = customers[index];
  return (
    <div className="flex items-center gap-2 text-gray-600 text-sm">
      <button
        onClick={() => handleEditClick(index)}
        className="hover:text-blue-600"
        title="Edit"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={() => handleDeleteClick(index)}
        className="hover:text-red-600"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
      <Link to={`/customers/${customer.id}/ledger`} title="View Ledger">
        <BookOpen size={16} className="hover:text-blue-600" />
      </Link>
    </div>
  );
}}

      />

      <Pagination
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
      />
<CustomerModal
  show={showCustomerModal}
  onClose={() => {
    setShowCustomerModal(false);
    setEditCustomerData(null);
  }}
  onSubmit={handleCustomerSubmit}
  initialData={editCustomerData}
/>

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (!selectedCustomer) return;
          try {
            await deleteCustomer(selectedCustomer.id);
            toast.success("Customer deleted");
            setShowDeleteModal(false);
            fetchCustomers();
          } catch {
            toast.error("Failed to delete customer");
          }
        }}
        message={`Are you sure you want to delete "${selectedCustomer?.name}"?`}
      />
    </div>
  );
};

export default CustomerList;
