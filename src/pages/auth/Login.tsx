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
      navigate("/items",{replace:true}); 
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4"
    style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1350&q=80')",
  }}
    >
  <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">🔐 Login to Your Account</h2>

    <InputField
      label="Email"
      name="email"
      type="email"
      value={form.email}
      onChange={handleChange}
      placeholder="enter the email"
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
      className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
    >
      {loading ? "Logging in..." : "Login"}
    </button>

    {/* Link to registration */}
    <p className="mt-4 text-center text-sm text-gray-600">
      Not registered?{" "}
      <a
        href="/register"
        className="text-blue-600 hover:underline font-medium"
      >
        Create an account
      </a>
    </p>
  </form>
</div>

  );
};

export default Login;
