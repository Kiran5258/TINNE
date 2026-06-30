import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const WhatsappIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const FooterLeafDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 90 Q 50 60 70 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M70 10 C 65 15, 60 18, 70 22 C 80 18, 75 15, 70 10" />
    <path d="M55 35 C 45 32, 38 35, 45 45 C 55 42, 58 38, 55 35" />
    <path d="M38 60 C 28 55, 20 60, 28 70 C 38 68, 40 64, 38 60" />
    <path d="M57 38 C 67 35, 75 38, 68 48 C 58 45, 55 41, 57 38" />
    <path d="M40 63 C 50 60, 58 63, 51 73 C 41 70, 38 66, 40 63" />
  </svg>
);

const SmallLeafSVG = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 8C8 9 9 17 9 17C9 17 17 18 18 10C18 9 18 8 17 8Z" />
    <path d="M9 17C8.5 17.5 7 21 7 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <>
      <footer className="bg-[#153A1D] text-white pt-16 pb-12 relative overflow-hidden font-sans border-t border-[#224F2C]/30">
        {/* Wavy background watermarks */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex justify-around items-center">
          <SmallLeafSVG className="w-48 h-48 rotate-12" />
          <SmallLeafSVG className="w-64 h-64 -rotate-45" />
        </div>

        {/* Decorative Twigs in Corners */}
        <FooterLeafDeco className="absolute bottom-[-10px] left-[-15px] w-36 h-36 text-[#224F2C] opacity-45 pointer-events-none transform rotate-[25deg]" />
        <FooterLeafDeco className="absolute bottom-[-10px] right-[-15px] w-36 h-36 text-[#224F2C] opacity-45 pointer-events-none transform -rotate-[75deg] -scale-x-100" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
            
            {/* Col 1: Logo & Socials */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-2.5 leading-none mb-6 group">
                <img src="/logo.png" alt="Tinné logo" className="w-9 h-9 rounded-full border border-white/10 bg-white p-0.5 object-cover" />
                <div className="flex flex-col">
                  <span className="text-2xl font-script font-bold text-white tracking-wide">Tinné</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#A7F3D0] font-sans mt-0.5">From Grandma's Thinnai</span>
                </div>
              </Link>
              <p className="text-[#A3B89E] text-sm leading-relaxed mb-6 font-light">
                Bringing you the finest natural products, inspired by tradition and made for modern living.
              </p>
              
              {/* Social icons row */}
              <div className="flex space-x-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#224F2C] hover:bg-[#2e623a] text-white rounded-full transition-colors" aria-label="Instagram">
                  <InstagramIcon className="w-4.5 h-4.5" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#224F2C] hover:bg-[#2e623a] text-white rounded-full transition-colors" aria-label="Facebook">
                  <FacebookIcon className="w-4.5 h-4.5" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#224F2C] hover:bg-[#2e623a] text-white rounded-full transition-colors" aria-label="YouTube">
                  <YoutubeIcon className="w-4.5 h-4.5" />
                </a>
                <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#224F2C] hover:bg-[#2e623a] text-white rounded-full transition-colors" aria-label="WhatsApp">
                  <WhatsappIcon className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>

            {/* Col 2: Shop */}
            <div>
              <h3 className="font-display font-extrabold mb-6 text-sm tracking-wider uppercase text-white">Shop</h3>
              <ul className="space-y-3.5 text-[#A3B89E] text-sm font-light">
                <li><Link to="/products/millets" className="hover:text-white transition-colors">Millets</Link></li>
                <li><Link to="/products/nuts" className="hover:text-white transition-colors">Nuts & Seeds</Link></li>
                <li><Link to="/products/rice" className="hover:text-white transition-colors">Rice</Link></li>
                <li><Link to="/products/spices" className="hover:text-white transition-colors">Spices</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div>
              <h3 className="font-display font-extrabold mb-6 text-sm tracking-wider uppercase text-white">Company</h3>
              <ul className="space-y-3.5 text-[#A3B89E] text-sm font-light">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                <li><Link to="/join-team" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Col 4: Help */}
            <div>
              <h3 className="font-display font-extrabold mb-6 text-sm tracking-wider uppercase text-white">Help</h3>
              <ul className="space-y-3.5 text-[#A3B89E] text-sm font-light">
                <li><Link to="#" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Col 5: Stay Connected (Newsletter) */}
            <div className="relative">
              <h3 className="font-display font-extrabold mb-6 text-sm tracking-wider uppercase text-white">Stay Connected</h3>
              <p className="text-[#A3B89E] text-sm mb-4 font-light">
                Subscribe for updates, offers, and wholesome tips.
              </p>
              
              {subscribed ? (
                <div className="bg-[#224F2C] text-[#A7F3D0] text-xs p-3 rounded-full text-center shadow-inner">
                  Subscribed successfully!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email" 
                    className="bg-white/10 border border-white/10 rounded-l-full px-4 py-2.5 text-sm w-full focus:bg-white focus:text-[#1C2E1A] focus:placeholder-neutral-400 outline-none text-white placeholder-neutral-300 transition-all"
                  />
                  <button type="submit" className="bg-[#EAB308] hover:bg-yellow-400 text-[#1C2E1A] font-bold px-5 rounded-r-full text-sm transition-colors flex-shrink-0">
                    Subscribe
                  </button>
                </form>
              )}

              {/* Decorative leaf icon at bottom right of newsletter */}
              <div className="absolute right-0 -bottom-10 opacity-15 pointer-events-none text-white">
                <SmallLeafSVG className="w-10 h-10 rotate-[20deg]" />
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-[#224F2C] flex flex-col md:flex-row justify-between items-center text-xs text-[#A3B89E] font-light relative z-10">
            <p>&copy; {new Date().getFullYear()} Tinné. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
              <span className="cursor-pointer hover:text-white transition-colors">LinkedIn</span>
              <span className="cursor-pointer hover:text-white transition-colors">Twitter</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};