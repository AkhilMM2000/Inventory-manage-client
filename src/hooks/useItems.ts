import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';
import { getItems, deleteItemById, updateItemById } from '../api/item';
import type { Item } from '../types/Item';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal states
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getItems(page, limit, search);
      setItems(result.data);
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
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  const handleEdit = (index: number) => {
    setSelectedItem(items[index]);
    setShowEditModal(true);
  };

  const handleDelete = (index: number) => {
    setSelectedItem(items[index]);
    setShowDeleteModal(true);
  };

  const onDeleteConfirm = async () => {
    try {
      if (!selectedItem) return;
      await deleteItemById(selectedItem.id);
      toast.success("Item deleted successfully");
      setShowDeleteModal(false);
      fetchItems();
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const onUpdateSubmit = async (updatedItem: Partial<Item>) => {
    try {
      if (!selectedItem?.id) return;
      await updateItemById(selectedItem.id, updatedItem);
      toast.success("Item updated successfully");
      setShowEditModal(false);
      setSelectedItem(null);
      fetchItems();
    } catch (error: unknown) {
      let msg = "Something went wrong";
      if (axios.isAxiosError(error) && error.response) {
        msg = error.response.data?.error || msg;
      }
      toast.error(`❌ ${msg}`);
    }
  };

  return {
    items,
    page,
    setPage,
    limit,
    total,
    loading,
    search,
    handleSearchChange,
    // Modal states
    selectedItem,
    showDeleteModal,
    setShowDeleteModal,
    showEditModal,
    setShowEditModal,
    isAddModalOpen,
    setIsAddModalOpen,
    // Dropdown
    showExportDropdown,
    setShowExportDropdown,
    dropdownRef,
    // Actions
    handleEdit,
    handleDelete,
    onDeleteConfirm,
    onUpdateSubmit,
    refreshItems: fetchItems
  };
};
