import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import { getCustomers, deleteCustomer, updateCustomer, addCustomer } from "../api/customer";
import type { Customer, CustomerFormData } from "../types/Customer";

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCustomers(page, limit, search);
      setCustomers(result.data);
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
  }, [page, limit, search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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

  const onCustomerSubmit = async (form: CustomerFormData) => {
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

  const onDeleteConfirm = async () => {
    if (!selectedCustomer) return;
    try {
      await deleteCustomer(selectedCustomer.id);
      toast.success("Customer deleted");
      setShowDeleteModal(false);
      fetchCustomers();
    } catch {
      toast.error("Failed to delete customer");
    }
  };

  return {
    customers,
    page,
    setPage,
    limit,
    total,
    loading,
    handleSearch,
    // Modal states
    showDeleteModal,
    setShowDeleteModal,
    selectedCustomer,
    showCustomerModal,
    setShowCustomerModal,
    editCustomerData,
    // Actions
    handleDeleteClick,
    handleEditClick,
    handleAddCustomer,
    onCustomerSubmit,
    onDeleteConfirm,
    refreshCustomers: fetchCustomers
  };
};
