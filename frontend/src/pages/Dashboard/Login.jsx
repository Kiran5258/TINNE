import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Input from "../../components/Input"; // your custom input
import { Link } from "react-router-dom";

export default function Login() {
  const { login, isLoginIn } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!formData.email.trim())
      newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.password.trim())
      newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    login(formData);
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-center text-4xl mb-6">Log In</h1>

      {/* Breadcrumb */}
      <div className="text-center text-gray-500 mb-12">
        <Link to="/">Home</Link> <span className="mx-2">›</span> Account
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">

        {/* LEFT — LOGIN FORM */}
        <div>
          <h2 className="text-2xl  mb-6">Log In</h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <Input
              type="email"
              placeholder="Email"
              error={errors.email}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            {/* PASSWORD */}
            <Input
              type="password"
              placeholder="Password"
              error={errors.password}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <div className="flex flex-col space-y-8">

              <a href="#" className="text-sm underline text-gray-600 mt-4">
                Forgot your password?
              </a>

              <button
                type="submit"
                disabled={isLoginIn}
                className="w-40 bg-black text-white py-3 tracking-wider transition-all duration-300 ease-in-out hover:scale-[1.05] hover:bg-black/90 cursor-pointer"
              >
                {isLoginIn ? "Signing in..." : "SIGN IN"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT — NEW CUSTOMER BOX */}
        <div>
          <h2 className="text-2xl mb-6">New Customer</h2>

          <p className="text-gray-600 leading-relaxed mb-6">
            Sign up to get early access to sales, exclusive product launches, and personalized offers. You can unsubscribe anytime.
          </p>

          <a
            href="/signup"
            className="inline-block bg-black text-white px-10 py-3 tracking-wider transition-all duration-300 ease-in-out hover:scale-[1.05]"
          >
            REGISTER
          </a>
        </div>
      </div>
    </div>
  );
}
