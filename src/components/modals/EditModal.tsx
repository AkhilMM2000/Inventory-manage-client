import React, { useState, useEffect } from "react";
import type { Item } from "../../types/Item"; 
import InputField from "../forms/InputField";
import { validateDescription, validateName, validatePrice, validateQuantity } from "../../utils/validators";
import toast from "react-hot-toast";

interface EditItemModalProps {
  show: boolean;
  item: Item | null;
  onClose: () => void;
  onUpdate: (updatedItem: Partial<Item>) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({
  show,
  item,
  onClose,
  onUpdate,
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      });
    }
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "quantity" || name === "price" ? +value : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    const nameError = validateName(form.name);
const descError = validateDescription(form.description);
const qtyError = validateQuantity(form.quantity);
const priceError = validatePrice(form.price);

if (nameError || descError || qtyError || priceError) {
  toast.error(nameError || descError || qtyError || priceError); 
  return;
}

    if (item) {
      onUpdate({ ...form, id: item.id });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h3 className="text-lg font-semibold mb-4">Edit Item</h3>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
           <InputField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItemModal;
