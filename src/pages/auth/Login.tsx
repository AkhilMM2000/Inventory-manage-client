import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import InputField from "../../components/forms/InputField";
import toast from "react-hot-toast";
import axios from "axios";
import { validateEmail, validatePassword } from "../../utils/validators";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

const emailError = validateEmail(form.email);
const passwordError = validatePassword(form.password);
if (emailError || passwordError) {
  toast.error(emailError || passwordError);
  return;
}
    setLoading(true);
    try {
      const { accessToken } = await loginUser(form);
      localStorage.setItem("accessToken", accessToken);
      toast.success("Logged in successfully");
      navigate("/dashboard"); 
    }  catch (error: unknown) {
    let msg = "Something went wrong";
    
    if (axios.isAxiosError(error) && error.response) {
      msg = error.response.data?.error || msg;
    }

    toast.error(`❌ ${msg}`);
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
