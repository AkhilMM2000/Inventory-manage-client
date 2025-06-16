import React, { useState } from "react";
import { addItem } from "../../api/items";
import InputField from "../../components/forms/InputField";
import toast from "react-hot-toast";
import axios from "axios";
import {
  validateDescription,
  validatePrice,
  validateQuantity,
} from "../../utils/validators";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Optional callback to refetch items
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "quantity" || name === "price" ? +value : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const descError = validateDescription(form.description);
    const qtyError = validateQuantity(form.quantity);
    const priceError = validatePrice(form.price);

    if (descError || qtyError || priceError) {
      toast.error(descError || qtyError || priceError);
      return;
    }

    try {
      setLoading(true);
      await addItem(form);
      toast.success("✅ Item added!");
      setForm({ name: "", description: "", quantity: 0, price: 0 });
      onClose();
      onSuccess?.(); // trigger refetch if passed
    } catch (error: unknown) {
      let msg = "Something went wrong";
      if (axios.isAxiosError(error) && error.response) {
        msg = error.response.data?.error || msg;
      }
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20  z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Add Item</h2>

        <form onSubmit={handleSubmit}>
          <InputField label="Name" name="name" value={form.name} onChange={handleChange} />
          <InputField label="Description" name="description" value={form.description} onChange={handleChange} />
          <InputField label="Quantity" name="quantity" type="number" value={form.quantity.toString()} onChange={handleChange} />
          <InputField label="Price" name="price" type="number" value={form.price.toString()} onChange={handleChange} />

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
