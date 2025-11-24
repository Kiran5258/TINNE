// src/components/AccountSidebar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import AddProduct from "./AddProduct";

export default function AccountSidebar() {
  const { authUser,logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6 text-lg">
      <Link to="/account" className="block hover:text-black">Dashboard</Link>
      <Link to="/account/addresses" className="block hover:text-black">Addresses</Link>
      {authUser?.isAdmin&&(
        <AddProduct/>
      )}
      <button
        onClick={handleLogout}
        className="block text-left hover:text-black cursor-pointer"
      >
        Log Out
      </button>
    </div>
  );
}
