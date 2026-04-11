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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-5-5 5"/><path d="m7 19 5 5 5-5"/></svg>
            </span>
            Create New Sale
          </h1>
          <p className="text-slate-500 text-sm mt-1">Record a new transaction for your inventory</p>
        </div>
        <button
          onClick={() => navigate('/sales')}
          className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Sales
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Customer Selection</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600"
            >
              <option value="cash">Walk-in Customer (Cash)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Payment Type</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as "Cash" | "Credit")}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600"
            >
              <option value="Cash">Cash Sale</option>
              <option value="Credit">Credit Sale</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Add Items to Sale</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1 space-y-2">
              <label className="block text-xs font-semibold text-slate-500">Select Item</label>
              <select
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600"
              >
                <option value="">-- Search Item --</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (Qty: {item.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-500">Unit Quantity</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600"
              />
            </div>

            <button
              onClick={handleAddItem}
              disabled={quantity <= 0 || !itemId}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <span>+</span> Add to Cart
            </button>
          </div>
        </div>

        <div className="mb-8">
          <DataTable
            columns={[
              { header: "Purchased Item", className: "font-medium text-slate-900" },
              { header: "Quantity", className: "w-24 text-center" },
              { header: "Unit Price", className: "w-32" },
              { header: "Subtotal", className: "w-32 font-semibold" }
            ]}
            rows={selectedItems.map((item) => [
              <span className="text-slate-700">{item.name}</span>,
              <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600">{item.quantity}</span>,
              `₹${item.unitPrice.toFixed(2)}`,
              `₹${(item.quantity * item.unitPrice).toFixed(2)}`,
            ])}
            renderActions={(_, index) => (
              <button
                onClick={() => handleRemove(selectedItems[index].itemId)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Remove Item"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 pt-8">
          <div className="text-slate-500">
            <span className="text-sm">Total Items:</span>
            <span className="ml-2 font-bold text-slate-800">{selectedItems.length}</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grand Total</p>
              <p className="text-3xl font-black text-slate-900">
                ₹{selectedItems.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <button
              onClick={handleSubmit}
              className="bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-lg hover:shadow-emerald-100 active:scale-95 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              Confirm & Complete Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSale;
