
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import AddItem from "../pages/items/addItems";

import MainLayout from "../layout/MainLayout";
import ItemList from "../pages/items/ItemList";

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />


      <Route element={<MainLayout />}>
        {/* Now AddItem is rendered directly beneath the header */}
        <Route path="/items/add" element={<AddItem />} />
      
  <Route path="/items" element={<ItemList />} />
       
      </Route>

     
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
