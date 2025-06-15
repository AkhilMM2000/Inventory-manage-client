import React, { useEffect, useState } from "react";
import type { CustomerFormData } from "../../types/Customer"; 
import { validateAddress, validateMobile, validateName } from "../../utils/validators";
import toast from "react-hot-toast";

interface CustomerModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (form: CustomerFormData) => void;
  initialData?: CustomerFormData | null;
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  show,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [form, setForm] = useState<CustomerFormData>({
    name: "",
    address: "",
    mobile: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ name: "", address: "", mobile: "" });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      const nameError = validateName(form.name);
  const addressError = validateAddress(form.address);
  const mobileError = validateMobile(form.mobile);

  if (nameError || addressError || mobileError) {
    toast.error(nameError || addressError || mobileError);
    return;
  }
    onSubmit(form);
  };

  if (!show) return null;

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? "Edit Customer" : "Add Customer"}
        </h3>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
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
            {isEdit ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerModal;
