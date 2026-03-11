import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconBag, IconUser, IconSearch, IconMenu, IconClose } from './Icons';
import { useAuthStore } from '../services/useAuthStore';
import { useCartStore } from '../services/useCartStore';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { authUser } = useAuthStore();       // FIXED → use authUser
  const { getCartCount } = useCartStore();

  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white backdrop-blur-md shadow-sm py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">

        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none z-50 relative group">
          <span className="text-3xl font-script font-bold text-brand-dark tracking-wide">Tinné</span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-sans">
            From Grandma's Thinnai
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/blog">Blog</NavLink>

          <Link
            to="/products"
            className="bg-brand-accent text-brand-dark px-6 py-2 rounded-full font-bold 
            hover:bg-yellow-400 transition-all duration-300 shadow-sm 
            hover:shadow-md transform hover:-translate-y-0.5"
          >
            Products
          </Link>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-6 z-50">

          {/* Search */}
          <div className="relative flex items-center justify-end">
            {isSearchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 flex items-center bg-white border border-neutral-200 
                rounded-full px-3 py-1 shadow-lg w-72 z-[110] transition-all animate-in slide-in-from-right-10"
              >
                <button type="submit" className="p-1 text-neutral-400 hover:text-brand-dark">
                  <IconSearch className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent text-sm w-full h-8 px-2 outline-none"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-neutral-400 hover:text-neutral-900 ml-1 p-1"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <IconSearch className="w-5 h-5 text-neutral-600 hover:text-neutral-900" />
              </button>
            )}
          </div>

          {/* Account FIXED */}
          <Link to={authUser ? "/account" : "/login"} aria-label="Account">
            <IconUser className="w-5 h-5 text-neutral-600 hover:text-neutral-900" />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative group" aria-label="Cart">
            <IconBag className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-accent text-brand-dark 
              text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full 
              animate-bounce-short">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 relative p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <IconClose /> : <IconMenu />}
        </button>

        {/* Mobile Slide-over */}
        {createPortal(
          <div
            className={`fixed inset-0 bg-white z-[90] transform transition-transform duration-500
            ease-in-out md:hidden flex flex-col pt-32 px-8 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
          >
            {/* Mobile Menu Banner */}
            <div className="w-full h-32 mb-6 rounded-xl overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop"
                alt="Menu Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-white font-script text-3xl font-bold">Pure & Organic</span>
              </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="mb-8 relative">
              <button
                type="submit"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                <IconSearch className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-neutral-100 rounded-full py-3 pl-12 pr-4 outline-none 
                focus:ring-2 focus:ring-brand-accent/50"
              />
            </form>

            {/* Links */}
            <div className="flex flex-col space-y-6 text-2xl font-display font-medium">

              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/products" className="text-brand-dark font-bold">
                Products
              </Link>

              <div className="h-px bg-neutral-100 w-full my-4" />

              <Link to="/cart" className="flex items-center justify-between">
                Cart{" "}
                <span className="text-sm bg-neutral-100 px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              </Link>

              {/* Account FIXED */}
              <Link
                to={authUser ? "/account" : "/login"}
                className="text-lg text-neutral-600"
              >
                {authUser ? "My Account" : "Log In / Sign Up"}
              </Link>
            </div>
          </div>,
          document.body
        )}
      </div>
    </nav>
  );
};


const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  return (
    <Link
      to={to}
      className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors 
      relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 
      after:h-[2px] after:bg-brand-accent after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </Link>
  );
};
