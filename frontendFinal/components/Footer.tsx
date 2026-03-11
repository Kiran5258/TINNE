import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex flex-col leading-none mb-6">
            <span className="text-3xl font-script font-bold text-white tracking-wide">Tinné</span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-sans mt-1">From Grandma's Thinnai</span>
          </Link>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Premium organic bulk products for businesses and conscious consumers. Sourced directly from farmers.
          </p>
        </div>
        
        <div>
          <h3 className="font-bold mb-6 text-lg">Shop</h3>
          <ul className="space-y-4 text-neutral-400 text-sm">
            <li><Link to="/products/millet" className="hover:text-white transition-colors">Millets</Link></li>
            <li><Link to="/products/nuts" className="hover:text-white transition-colors">Nuts & Seeds</Link></li>
            <li><Link to="/products/rice" className="hover:text-white transition-colors">Rice</Link></li>
            <li><Link to="/products/spices" className="hover:text-white transition-colors">Spices</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-lg">Company</h3>
          <ul className="space-y-4 text-neutral-400 text-sm">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-6 text-lg">Newsletter</h3>
          <p className="text-neutral-400 text-sm mb-4">Subscribe for wholesale updates.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-neutral-800 border-none rounded-l-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-brand-accent outline-none text-white placeholder-neutral-500"
            />
            <button className="bg-brand-accent text-brand-dark font-bold px-4 rounded-r-lg text-sm hover:bg-yellow-400 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
        <p>&copy; {new Date().getFullYear()} Tinne Inc. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <span className="cursor-pointer hover:text-white">Instagram</span>
          <span className="cursor-pointer hover:text-white">LinkedIn</span>
          <span className="cursor-pointer hover:text-white">Twitter</span>
        </div>
      </div>
    </footer>
  );
};