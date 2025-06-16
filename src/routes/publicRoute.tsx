import type { JSX } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    // 🚫 Already logged in, block access to /login or /register
    return <Navigate to="/items" replace />;
  }

  return children;
};

export default PublicRoute;
