// src/pages/Dashboard/Account.jsx
import { Link } from "react-router-dom";
import AccountLayout from "../../components/AccountLayout";
import { useAuthStore } from "../../store/useAuthStore";

export default function Account() {
  const { authUser } = useAuthStore();

  return (
    <AccountLayout title="My Account">
      {/* WELCOME */}
      <p className="text-lg mb-8">
        Hello <b>{authUser?.firstName} {authUser?.lastName}</b>
      </p>

      {/* ORDER BOX */}
      <div className="bg-green-100 border border-green-300 px-6 py-4 rounded mb-10 flex items-center">
        <span className="mr-3">✔</span>
        <p>
          <a href="#" className="underline font-medium">Make your first order.</a>{" "}
          You haven’t placed any orders yet.
        </p>
      </div>

      {/* ACCOUNT DETAILS */}
      <h2 className="text-2xl font-semibold mb-6">Account Details</h2>

      <div className="space-y-5 mb-10">
        <div>
          <p className="text-gray-600">Name</p>
          <p className="text-lg">{authUser?.firstName} {authUser?.lastName}</p>
        </div>

        <div>
          <p className="text-gray-600">Email</p>
          <p className="text-lg">{authUser?.email}</p>
        </div>

        <div>
          <p className="text-gray-600">Address No</p>
          <p className="text-lg">{authUser?.address?.addressNo}</p>
        </div>
      </div>

      <Link to="/account/addresses" className="bg-black text-white px-6 py-3 tracking-wider">
        VIEW ADDRESSES
      </Link>
    </AccountLayout>
  );
}
