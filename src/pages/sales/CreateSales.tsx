import React, { useEffect, useState } from "react";
import { getCustomers } from "../../api/customer";
import { getItems } from "../../api/item";
import { createSale } from "../../api/Sales"; 
import type { Customer } from "../../types/Customer";
import type { Item } from "../../types/Item"; 
import type { SaleItem } from "../../types/Sales"; 
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/table/DataTable";

const CreateSale: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("cash");
  const [paymentType, setPaymentType] = useState<"Cash" | "Credit">("Cash");
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
console.log(selectedItems)
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
  const selected = selectedItems.find((i) => i.itemId === itemId);
  const item = items.find((i) => i.id === itemId);

  if (!item) {
    toast.error("Please select an  item");
    return;
  }

 if(item.quantity==0){
  toast.error(`stocks become empty now`);
    return;
 }

  if ( item.quantity<quantity) {
    toast.error(`Only ${item.quantity} units available`);
    return;
  }

  if (selected) {
    // Update existing item
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.itemId === itemId
          ? { ...i, quantity: i.quantity + quantity }
          : i
      )
    );
  } else {
    // Add new item
    setSelectedItems((prev) => [
      ...prev,
      {
        itemId: item.id,
        name: item.name,
        quantity,
        unitPrice: item.price,
      },
    ]);
  }

  // ✅ Update inventory once
  setItems((prev) =>
    prev.map((i) =>
      i.id === itemId
        ? { ...i, quantity: i.quantity - quantity }
        : i
    )
  );

  // Reset
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
  const handleRemove = (id:string) => {
   const item= selectedItems.find((i) => i.itemId === id);
   setItems((prev) =>
     prev.map((i) =>
       i.id === id ? { ...i, quantity: i.quantity + (item?.quantity || 0) } : i 
      ));

      setSelectedItems((prev) => prev.filter((item) => item.itemId!== id));
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

       <div className="w-full mb-4">
    
      <div className="hidden md:block">
         <DataTable
  columns={[ "Item ", "Quantity", "Price", "Subtotal (₹)"]}
     rows={selectedItems.map((item) => [
        
          item.name,
          item.quantity,
          item.unitPrice.toFixed(2),
         (item.quantity * item.unitPrice).toFixed(2),
        
        ])}
    renderActions={(_, index) => {
  
    return (
      <div className="flex gap-2">
        <button
         onClick={() => handleRemove(selectedItems[index].itemId)}
          className="text-blue-600 hover:underline"
        >
         Remove
        </button>
       
      </div>
    );
  }}
/>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {selectedItems.map((item, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 flex-1 pr-2">{item.name}</h3>
              <span className="text-lg font-semibold text-gray-900">₹{(item.quantity * item.unitPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Qty: {item.quantity}</span>
              <span>Price: ₹{item.unitPrice.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

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
