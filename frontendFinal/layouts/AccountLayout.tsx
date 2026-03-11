import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../services/useAuthStore';

import {
  IconUser,
  IconMapPin,
  IconBox,
  IconLogout,
  IconPlus,
  IconBarChart,
  IconPackage  // <- you can use any icon for "All Orders"
} from '../components/Icons';

export const AccountLayout: React.FC = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /** -------------------------------
   * USER MENU (DEFAULT)
   --------------------------------*/
  let menuItems = [
    { label: "Profile", path: "/account/profile", icon: IconUser },
    { label: "My Orders", path: "/account/orders", icon: IconBox },
    { label: "Addresses", path: "/account/addresses", icon: IconMapPin },
  ];

  /** -------------------------------
   * ADMIN MENU
   --------------------------------*/
  if (authUser?.role === "admin") {
    menuItems = menuItems.filter(item => item.label !== "My Orders");

    menuItems.unshift(
      {
        label: "Admin Dashboard",
        path: "/account/admin",
        icon: IconBarChart,
      }
    );

    menuItems.push(
      {
        label: "All Orders",
        path: "/account/admin/orders",
        icon: IconPackage,
      },
      {
        label: "Add Post",
        path: "/account/add-post",
        icon: IconPlus,
      },
      {
        label: "Add Product",
        path: "/account/add-product",
        icon: IconPlus,
      }, {
      label: "Add Hero Banner",
      path: "/account/add-hero-bg",
      icon: IconPlus,
    }
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[60vh]">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-neutral-50 rounded-2xl p-6 sticky top-24">

            {/* User Header */}
            <div className="flex items-center space-x-3 mb-8 pb-8 border-b border-neutral-200">
              <div className="w-12 h-12 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold text-lg">
                {authUser?.fullName?.charAt(0)}
              </div>

              <div>
                <p className="font-bold text-neutral-900">{authUser?.fullName}</p>
                <p className="text-xs text-neutral-500">{authUser?.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive
                      ? "bg-white shadow-sm text-brand-dark font-medium"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors mt-8"
              >
                <IconLogout className="w-5 h-5" />
                <span>Log Out</span>
              </button>

            </nav>

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-2xl min-h-[500px] shadow-sm p-2">
          <Outlet />
        </main>

      </div>
    </div>
  );
};
