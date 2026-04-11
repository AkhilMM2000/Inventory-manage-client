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
    address: {
      line1: "",
      line2: "",
      city: "",
      district: "",
      state: "",
      postalCode: "",
      country: "",
    },
    mobile: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        address: {
          line1: "",
          line2: "",
          city: "",
          district: "",
          state: "",
          postalCode: "",
          country: "",
        },
        mobile: "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm({
        ...form,
        address: {
          ...form.address,
          [field]: value,
        },
      });
      return;
    }

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

    if (initialData) {
      // Logic for partial update: send only changed fields
      const dirtyFields: any = {};
      
      if (form.name !== (initialData as any).name) dirtyFields.name = form.name;
      if (form.mobile !== (initialData as any).mobile) dirtyFields.mobile = form.mobile;
      
      // Address diffing
      const addressDiff: any = {};
      let addressChanged = false;
      
      Object.keys(form.address).forEach((key) => {
        const k = key as keyof typeof form.address;
        if (form.address[k] !== (initialData as any).address[k]) {
          addressDiff[k] = form.address[k];
          addressChanged = true;
        }
      });
      
      if (addressChanged) {
        dirtyFields.address = addressDiff;
      }

      if (Object.keys(dirtyFields).length === 0) {
        toast.error("No changes detected");
        return;
      }
      
      onSubmit(dirtyFields);
    } else {
      // New customer: send everything
      onSubmit(form);
    }
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
            name="address.line1"
            placeholder="Address Line 1"
            value={form.address.line1}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="address.line2"
            placeholder="Address Line 2 (optional)"
            value={form.address.line2 || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="address.city"
            placeholder="City"
            value={form.address.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="address.district"
            placeholder="District"
            value={form.address.district}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="address.state"
            placeholder="State"
            value={form.address.state}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="address.postalCode"
            placeholder="Postal Code"
            value={form.address.postalCode}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="address.country"
            placeholder="Country"
            value={form.address.country}
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
