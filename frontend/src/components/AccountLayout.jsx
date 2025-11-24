import { Link } from "react-router-dom";
import AccountSidebar from "./AccountSidebar";

export default function AccountLayout({ title, children }) {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <h1 className="text-center text-4xl  mb-6">{title}</h1>

      <div className="text-center text-gray-500 mb-12">
        <Link to="/">Home</Link><span className="mx-2">›</span> {title}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <AccountSidebar />
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
