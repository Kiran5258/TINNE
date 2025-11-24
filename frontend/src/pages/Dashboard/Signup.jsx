import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Input from "../../components/Input";
import { Link } from "react-router-dom";
import { validateSignup } from "../../utils/validation";

export default function Signup() {
  const { signup, isSignup } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: {
      addressNo: "",
      city: "",
      state: "",
      pinNo: "",
      address:"",
    },
  });

  const [errors, setErrors] = useState({});


  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateSignup(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    signup(formData);
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <h1 className="text-center text-4xl font-semibold mb-6">Register</h1>

      <div className="text-center text-gray-500 mb-12">
        <Link to="/" className="cursor-pointer">Home</Link> <span className="mx-2">›</span> Create Account
      </div>

      <h2 className="text-2xl mb-6">Register</h2>

      {/* FORM --------------------------- */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* NAME */}
        <Input
          placeholder="First Name"
          error={errors.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />

        <Input
          placeholder="Last Name"
          error={errors.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />

        {/* EMAIL */}
        <Input
          type="email"
          placeholder="Email"
          error={errors.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <Input
          type="password"
          placeholder="Password"
          error={errors.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* ADDRESS SECTION */}
        <h2 className="text-xl font-semibold mt-10">Address</h2>

        <Input
          placeholder="Door No / Address Line"
          error={errors.addressNo}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, addressNo: e.target.value },
            })
          }
        />
        <Input
          placeholder="Address"
          error={errors.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, address: e.target.value },
            })
          }
        />

        <Input
          placeholder="City"
          error={errors.city}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, city: e.target.value },
            })
          }
        />

        <Input
          placeholder="State"
          error={errors.state}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, state: e.target.value },
            })
          }
        />

        <Input
          placeholder="PIN Code"
          error={errors.pinNo}
          onChange={(e) =>
            setFormData({
              ...formData,
              address: { ...formData.address, pinNo: e.target.value },
            })
          }
        />

        <p className="text-gray-600 text-sm leading-relaxed">
          Sign up for early Sale access plus tailored new arrivals, trends and
          promotions. To opt out, click unsubscribe in our emails.
        </p>

        <button
          type="submit"
          disabled={isSignup}
          className="w-full bg-black text-white py-3 tracking-wider relative overflow-hidden group"
        >
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
            {isSignup ? "Creating..." : "REGISTER"}
          </span>
        </button>

        <a
          href="/login"
          className="block w-full border py-3 text-center tracking-wider hover:bg-black hover:text-white transition duration-500"
        >
          LOG IN
        </a>
      </form>
    </div>
  );
}
