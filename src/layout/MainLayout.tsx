import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthUser } from "../hooks/authUser"; 

const MainLayout = () => {
  const { user, loading } = useAuthUser();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🧾 Inventory Store</h1>
        <span className="text-gray-600">👤 {user?.name || "User"}</span>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
