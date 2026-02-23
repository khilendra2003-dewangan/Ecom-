import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const Login = () => {
  const { Login } = useUser()

  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",

  });


  const hanldeOnChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form, [name]: value
    })

  }


  const handleOnSubmit = async (e) => {
    e.preventDefault();
    await Login(form)
    navigate("/")

  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6] noise-bg selection:bg-[#C5A059] selection:text-white pb-32 pt-20 px-4">
      <div className="bg-white/60 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-white/20 rounded-[2rem] p-10 md:p-12 w-full max-w-md">
        <h2 className="text-4xl font-serif-lux text-center text-[var(--color-espresso)] mb-8 tracking-tight">
          Welcome Back
        </h2>

        <form className="space-y-5" onSubmit={handleOnSubmit}>



          <div>
            <label className="block text-[var(--color-espresso)]/80 text-xs font-bold uppercase tracking-widest mb-2 px-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={form.email}
              onChange={hanldeOnChange}
              className="w-full px-5 py-4 bg-white/80 border border-black/5 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all placeholder:text-gray-400 text-[var(--color-espresso)]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[var(--color-espresso)]/80 text-xs font-bold uppercase tracking-widest mb-2 px-1 mt-6">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={form.password}
              onChange={hanldeOnChange}
              className="w-full px-5 py-4 bg-white/80 border border-black/5 rounded-xl focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all placeholder:text-gray-400 text-[var(--color-espresso)]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[var(--color-espresso)] text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Login
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-[var(--color-espresso)]/60 mt-8" onClick={() => navigate("/register")}>
          Don't have an account?
          <span className="text-[#C5A059] cursor-pointer hover:text-[var(--color-espresso)] hover:underline ml-1.5 font-semibold transition-colors">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
