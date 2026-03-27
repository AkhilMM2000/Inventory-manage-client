import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a loading spinner

  if (user) {
    // 🚫 Already logged in, block access to /login or /register
    return <Navigate to="/items" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

