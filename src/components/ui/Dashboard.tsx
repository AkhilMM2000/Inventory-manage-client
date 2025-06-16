import { Link } from "react-router-dom";
import { Warehouse, LogIn, UserPlus } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-indigo-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full text-center">
        <div className="flex justify-center mb-6 text-blue-600">
          <Warehouse size={48} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          Inventory Management System
        </h1>
        <p className="text-gray-500 mb-8 text-sm sm:text-base">
          Track your stock, manage customers, record sales – all in one place.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow text-sm sm:text-base transition">
              <UserPlus size={18} /> Register
            </button>
          </Link>

          <Link to="/login">
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow text-sm sm:text-base transition">
              <LogIn size={18} /> Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
