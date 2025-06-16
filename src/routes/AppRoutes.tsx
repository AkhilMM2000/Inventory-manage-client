
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import AddItem from "../pages/items/addItems";

import MainLayout from "../layout/MainLayout";
import ItemList from "../pages/items/ItemList";
import CustomerList from "../pages/customers/CustomerList";
import SalesList from "../pages/sales/SalesList";
import CreateSale from "../pages/sales/CreateSales";
import CustomerLedger from "../pages/customers/CustomerLedger";
import PublicRoute from "./publicRoute";
import Dashboard from "../components/ui/Dashboard";

const AppRoutes = () => {
  
  return (
    <Routes>

      <Route path="/"   element={
    <PublicRoute>
      <Dashboard/>
    </PublicRoute>
  } />
     <Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>

<Route
  path="/register"
  element={
    <PublicRoute>
      <Register />
    </PublicRoute>
  }
/>



      <Route element={<MainLayout />}>
        {/* Now AddItem is rendered directly beneath the header */}
        <Route path="/items/add" element={<AddItem />} />
      
  <Route path="/items" element={<ItemList />} />
       <Route path="/customers" element={<CustomerList/>}/>
       <Route path="/sales" element={<SalesList/>}/>
         <Route path="/addsale" element={<CreateSale/>}/>
         <Route path="/customers/:id/ledger" element={<CustomerLedger />} />

      </Route>

     
      <Route path="*" element={<Navigate to="/" replace />} />
      
   
    </Routes>
  );
};

export default AppRoutes;
