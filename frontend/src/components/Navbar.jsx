import { useState } from "react";
import { Link } from "react-router-dom";
// IMPORT GLOBAL DATA
import { productList, mainMenu } from "../constants/menu";
import { Icons } from "../constants/icons";
import { useAuthStore } from "../store/useAuthStore";
import SearchBar from "./SearchBar";
const {
  MenuIcon,
  CloseIcon,
  RightIcon,
  LeftIcon,
  SearchIcon,
  UserIcon,
  CartIcon,
} = Icons;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submenu, setSubmenu] = useState(null);
  const { authUser } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");


  return (
    <>
      {/* MAIN NAVBAR */}
      <div className="w-full border-b bg-white">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between py-5">

          {/* LEFT — Logo + Hamburger */}
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden"
              onClick={() => {
                setMobileOpen(true);
                setSubmenu(null);
              }}
            >
              <MenuIcon className="w-7 h-7 text-black" />
            </button>

            <Link to="/" className="text-2xl font-semibold text-black tracking-wide">
              TINNE'
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex flex-1 justify-center items-center space-x-10 text-[16px] text-gray-800">

            <li className="relative group">
              <Link className="hover:text-black" to="/">Home</Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
            </li>

            <li className="relative group">
              <Link className="hover:text-black" to="/blog">Blog</Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-700  transition-all duration-300 group-hover:w-full"></span>
            </li>

            {/* PRODUCTS DROPDOWN */}
            <li className="relative group cursor-pointer">
              <div className="flex items-center hover:text-black">
                <span>Products</span>
                <RightIcon className="ml-1 w-4 h-4" />
              </div>

              {/* UNDERLINE */}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-700  transition-all duration-300 group-hover:w-full"></span>

              {/* DROPDOWN MENU */}
              <div className="absolute left-0 mt-3 w-72 bg-white shadow-lg rounded-md py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-9999">
                {productList.map((item, i) => (
                  <Link key={i} to={item.path}
                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    {item.label}
                  </Link>
                ))}
              </div>
            </li>

            <li className="relative group">
              <Link className="hover:text-black" to="/about">About Us</Link>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gray-700 transition-all duration-300 group-hover:w-full"></span>
            </li>

          </ul>


          {/* RIGHT ICONS */}
          <div className="hidden md:flex items-center space-x-6 text-black">
            <SearchIcon
              className="w-5 h-5 cursor-pointer hover:opacity-70"
              onClick={() => setShowSearch(!showSearch)}
            />

            {/* User Icon → auto redirect */}
            <Link to={authUser ? "/account" : "/login"}>
              <UserIcon className="w-5 h-5 cursor-pointer hover:opacity-70" />
            </Link>
            <Link to="/order"><CartIcon className="w-5 h-5" /></Link>
          </div>
        </div>
      </div>
      {/* SEARCH DROPDOWN */}
      {showSearch && <SearchBar />}



      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-[80%] bg-white shadow-xl z-9999 transform transition-transform duration-500 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* MOBILE HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          {submenu ? (
            <button className="flex items-center" onClick={() => setSubmenu(null)}>
              <LeftIcon className="w-6 h-6 mr-2" />
              <span className="text-lg font-medium">Back</span>
            </button>
          ) : (
            <h1 className="text-lg font-semibold text-black">Menu</h1>
          )}

          <button
            onClick={() => {
              setMobileOpen(false);
              setSubmenu(null);
            }}
            className="transition-transform duration-300 hover:rotate-90"
          >
            <CloseIcon className="w-7 h-7 text-black" />
          </button>
        </div>

        {/* MOBILE MAIN MENU */}
        {!submenu && (
          <ul className="p-4 space-y-6 text-[17px] text-black">
            <li><Link to="/" onClick={() => setMobileOpen(false)}>Home</Link></li>
            <li><Link to="/blog" onClick={() => setMobileOpen(false)}>Blog</Link></li>

            <li className="flex justify-between items-center cursor-pointer" onClick={() => setSubmenu("products")}>
              <span >Products</span>
              <RightIcon
                onClick={() => setSubmenu("products")}
                className="w-5 h-5"
              />
            </li>

            <li><Link to="/about" onClick={() => setMobileOpen(false)}>About Us</Link></li>
          </ul>
        )}

        {/* MOBILE SUBMENU */}
        {submenu === "products" && (
          <div className="p-4 space-y-6 text-[17px] text-black animate-slide-left">
            {productList.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="block cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-500"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  );
}
