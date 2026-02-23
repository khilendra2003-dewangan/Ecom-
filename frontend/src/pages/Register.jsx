import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";

const Register = () => {

  const {Register}=useUser()
  const navigate=useNavigate()
const [form, setForm] = useState({
    name:"",
    email:"",
    password:"",
   
});


const hanldeOnChange=(e)=>{
    const {name,value}=e.target;

    setForm({
        ...form,[name]:value
    })

}


const handleOnSubmit=async(e)=>{
  e.preventDefault();
 await Register(form)
 navigate("/login")


}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Create Account
        </h2>

        <form className="space-y-5"  onSubmit={handleOnSubmit}>
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="name"
              value={form.name}
              onChange={hanldeOnChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              value={form.email}
              onChange={hanldeOnChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={form.password}
              onChange={hanldeOnChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4"  onClick={()=>navigate("/login")}>
          Already have an account?
          <span className="text-indigo-600 cursor-pointer hover:underline ml-1">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
