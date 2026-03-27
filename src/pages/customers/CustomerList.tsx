import { useEffect, useState, useCallback } from "react";
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
    } catch (error: unknown) {
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
    setEditCustomerData(customer);
    setShowCustomerModal(true);
  };

  const handleAddCustomer = () => {
    setEditCustomerData(null);
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

  const formatAddress = (c: Customer) => {
    const { line1, line2, city, district, state, postalCode, country } = c.address;
    const parts = [
      line1,
      line2,
      city,
      district,
      state,
      postalCode,
      country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BookOpen size={24} />
            </span>
            Customers
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and view your customer directory</p>
        </div>
        <button
          onClick={handleAddCustomer}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
        >
          <span className="text-lg">+</span> Add Customer
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6 relative">
          <input
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, phone or address..."
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-600"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

        <DataTable
          columns={[
            { header: "#", className: "w-16" },
            { header: "Customer Name", className: "font-medium text-slate-900" },
            { header: "Address", className: "max-w-md" },
            { header: "Mobile", className: "w-40" }
          ]}
          rows={customers.map((c, i) => [
            (page - 1) * limit + i + 1,
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800">{c.name}</span>
              <span className="text-xs text-slate-400">ID: {c.id.slice(0, 8)}...</span>
            </div>,
            <div className="leading-relaxed text-slate-500 text-sm">
              {formatAddress(c)}
            </div>,
            <span className="font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded text-xs">{c.mobile}</span>,
          ])}
          renderActions={(_, index) => {
            const customer = customers[index];
            return (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEditClick(index)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  title="Edit Customer"
                >
                  <Pencil size={18} />
                </button>
                <Link 
                  to={`/customers/${customer.id}/ledger`} 
                  className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                  title="View Ledger"
                >
                  <BookOpen size={18} />
                </Link>
                <button
                  onClick={() => handleDeleteClick(index)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Customer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          }}
        />

        <div className="mt-8 border-t border-slate-50 pt-6">
          <Pagination
            page={page}
            limit={limit}
            total={total}
            onPageChange={setPage}
          />
        </div>
      </div>

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
        message={`Are you sure you want to delete "${selectedCustomer?.name}"? This action cannot be undone.`}
      />
    </div>
  );

};

export default CustomerList;
