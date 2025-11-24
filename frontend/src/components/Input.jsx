import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Input({ label, type = "text", value, onChange, placeholder, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col mb-3 w-full">
      {label && (
        <label className="text-gray-600 font-medium mb-1">{label}</label>
      )}

      <div
        className={`flex items-center border rounded-lg px-3 
        ${error ? "border-red-500" : "border-gray-300"}`}
      >
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full py-2 focus:outline-none"
        />

        {/* PASSWORD TOGGLE */}
        {isPassword &&
          (showPassword ? (
            <EyeOff
              size={20}
              className="cursor-pointer text-gray-500"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              size={20}
              className="cursor-pointer text-gray-500"
              onClick={() => setShowPassword(true)}
            />
          ))}
      </div>

      {/* ERROR MESSAGE */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default Input;
