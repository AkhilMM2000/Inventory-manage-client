import React, { useState } from "react";
import InputField from "../../components/forms/InputField";
import { registerUser } from "../../api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateEmail, validateName, validatePassword } from "../../utils/validators";

const Register = () => {
  const [form, setForm] = useState({
  fullName: "",
  email: "",
  password: ""
});

const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
const nameError = validateName(form.fullName);
const emailError = validateEmail(form.email);
const passwordError = validatePassword(form.password);

if (nameError || emailError || passwordError) {
  toast.error(nameError || emailError || passwordError);
  setLoading(false);
  return;
}
    try {
      await registerUser(form);
      toast.success("✅ Registration successful!");
      navigate("/login"); // or redirect to dashboard
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
     <div
  className="flex justify-center items-center min-h-screen bg-cover bg-center px-4"
  style={{
    backgroundImage:
      "url('https://plus.unsplash.com/premium_photo-1686878940830-9031355ec98c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  }}
>
  <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-md">
    <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">🧾 Register Your Account</h2>

    <InputField
      label="Full Name"
      name="fullName"
      value={form.fullName}
      placeholder="Enter name"
      onChange={handleChange}
    />

    <InputField
      label="Email"
      name="email"
      type="email"
      value={form.email}
      placeholder="Enter email"
      onChange={handleChange}
    />

    <InputField
      label="Password"
      name="password"
      type="password"
      value={form.password}
      placeholder="••••••••"
      onChange={handleChange}
    />

    <button
      type="submit"
      disabled={loading}
      className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
    >
      {loading ? "Registering..." : "Register"}
    </button>

    <p className="mt-4 text-center text-sm text-gray-700">
      Already registered?{" "}
      <a href="/login" className="text-blue-600 hover:underline font-medium">
        Login here
      </a>
    </p>
  </form>
</div>

  );
};

export default Register;
