import React, { useEffect, useState } from "react";
import { getCustomers } from "../../api/customer";
import { getItems } from "../../api/item";
import { createSale } from "../../api/Sales"; 
import type { Customer } from "../../types/Customer";
import type { Item } from "../../types/Item"; 
import type { SaleItem } from "../../types/Sales"; 
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateSale: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("cash");
  const [paymentType, setPaymentType] = useState<"Cash" | "Credit">("Cash");
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerRes = await getCustomers();
        setCustomers(customerRes.data);

        const itemRes = await getItems();
        setItems(itemRes.data.filter((i) => i.quantity > 0));
      } catch {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    const existing = selectedItems.find((i) => i.itemId === itemId);
    const item = items.find((i) => i.id === itemId);
    if (!item || existing) return;

    if (quantity > item.quantity) {
      toast.error(`Only ${item.quantity} units available`);
      return;
    }

    setSelectedItems((prev) => [
      ...prev,
      {
        itemId: item.id,
        name: item.name,
        quantity,
        unitPrice: item.price,
      },
    ]);

    setItemId("");
    setQuantity(1);
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    const customer =
      selectedCustomerId === "cash"
        ? { id: "cash", name: "Cash" }
        : customers.find((c) => c.id === selectedCustomerId);

    if (!customer) {
      toast.error("Invalid customer");
      return;
    }

    try {
      await createSale({
        customerId: customer.id,
        customerName: customer.name,
        paymentType,
        items: selectedItems,
      });

      toast.success("Sale created");
      navigate("/sales");
    } catch {
      toast.error("Sale failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">➕ Create New Sale</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Customer</label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="cash">Cash</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as "Cash" | "Credit")}
            className="w-full border p-2 rounded"
          >
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Item</label>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Item --</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (Stock: {item.quantity})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <button
        onClick={handleAddItem}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Add Item
      </button>

      <table className="w-full text-sm border mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Item</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Price</th>
            <th className="p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">₹{item.unitPrice}</td>
              <td className="p-2">₹{item.quantity * item.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-semibold mb-4">
        Total: ₹
        {selectedItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ✅ Submit Sale
        </button>
      </div>
    </div>
  );
};

export default CreateSale;
