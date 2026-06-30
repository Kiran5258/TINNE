import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./services/useAuthStore";
import { useCartStore } from "./services/useCartStore";
import { axiosInstance } from "./config/axios";

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Register } from './pages/Register';
import { VerifyOtp } from './pages/VerifyOtp';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { AddProduct } from './pages/AddProduct';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Blog } from './pages/Blog';
import { BlogDetails } from './pages/BlogDetails';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { AccountLayout } from './layouts/AccountLayout';
import { AddPost } from './pages/AddPost';
import { Checkout } from "./pages/checkout";
import { AccountOrders } from './pages/AccountOrders';
import { OrderDetails } from './pages/OrderDetails';
import { AdminOrders } from './pages/AdminOrders';
import { AdminOrderDetails } from './pages/AdminOrderDetails';
import { ScrollToTop } from './components/ScrollToTop';
import EditProduct from './pages/EditProduct';
import { AdminHeroBanner } from './pages/AdminHeroBanner';
import { Ambassador } from './pages/Ambassador';
import { AdminAmbassadors } from './pages/AdminAmbassadors';

// Placeholder Page
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="pt-32 pb-20 text-center min-h-[50vh]">
    <h1 className="text-3xl font-display font-bold mb-4">{title}</h1>
    <p className="text-neutral-500">Content coming soon.</p>
  </div>
);

const App: React.FC = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const { authUser } = useAuthStore();
  const { applyDiscount, removeDiscount } = useCartStore();

  const [isInitializing, setIsInitializing] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Run auth check and settings load on startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAuth();
      } catch (e) {
        console.error("Auth check failed", e);
      }
      try {
        await fetchGlobalSettings();
      } catch (e) {
        console.error("Settings fetch failed", e);
      }
      
      // Start fade out transition
      setTimeout(() => {
        setIsAnimatingOut(true);
        // Cleanly unmount from DOM after transition completes (700ms)
        setTimeout(() => {
          setIsInitializing(false);
        }, 700);
      }, 900);
    };

    initializeApp();
  }, []);

  const fetchGlobalSettings = async () => {
    try {
      const res = await axiosInstance.get('/settings');
      if (res.data && res.data.globalOffer && res.data.globalOffer.enabled) {
        const { percentage, promoCode } = res.data.globalOffer;
        if (!promoCode || promoCode.trim() === "") {
          applyDiscount(percentage, "GLOBAL_OFFER");
        } else {
          removeDiscount();
        }
      } else {
        removeDiscount();
      }
    } catch (error) {
      console.error("Failed to fetch settings");
    }
  };

  return (
    <>
      {isInitializing && (
        <div className={`fixed inset-0 z-[9999] bg-[#FEFCE8] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${isAnimatingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative flex flex-col items-center">
            {/* Outer rotating decorative circle */}
            <div className="absolute w-32 h-32 border border-[#153A1D]/10 rounded-full animate-[spin_12s_linear_infinite] -translate-y-6" />
            
            {/* Second reverse rotating dotted ring */}
            <div className="absolute w-28 h-28 border border-dashed border-[#2E5E35]/20 rounded-full animate-[spin_8s_linear_infinite_reverse] -translate-y-6" />
            
            {/* Pulsing brand logo */}
            <div className="absolute w-20 h-20 flex items-center justify-center -translate-y-6 animate-[pulse_2.5s_infinite] z-10">
              <img src="/logo.png" alt="Tinné Logo" className="w-16 h-16 rounded-full border border-amber-900/10 object-cover shadow-sm bg-white" />
            </div>

            {/* Center content container with logo */}
            <div className="mt-36 text-center flex flex-col items-center font-sans">
              <span className="text-4xl font-script font-bold text-[#153A1D] tracking-wide">Tinné</span>
              <span className="text-[9px] uppercase tracking-widest text-[#2E5E35] font-sans mt-2 opacity-80">From Grandma's Thinnai</span>
              
              {/* Infinite smooth loading line */}
              <div className="w-24 h-[2px] bg-neutral-200/50 rounded-full mt-6 overflow-hidden relative">
                <div className="absolute h-full w-12 bg-[#153A1D] rounded-full animate-[loadingLine_1.5s_infinite_ease-in-out]" />
              </div>
            </div>
          </div>
          
          <style>{`
            @keyframes loadingLine {
              0% { left: -50px; }
              50% { left: 100px; }
              100% { left: -50px; }
            }
          `}</style>
        </div>
      )}

      <HashRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="grow">
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!authUser ? <Login /> : <Profile />} />
            <Route path="/signup" element={!authUser ? <Signup /> : <Profile />} />
            <Route path="/register" element={!authUser ? <Register /> : <Profile />} />
            <Route path="/verify-otp" element={!authUser ? <VerifyOtp /> : <Profile />} />

            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/join-team" element={<Ambassador />} />
            <Route path="/cart" element={authUser ? <Cart /> : <Login />} />

            {/* Product Routes */}
            <Route path="/products" element={<Products category="all" />} />
            <Route path="/products/millets" element={<Products category="millets" />} />
            <Route path="/products/nuts" element={<Products category="nuts" />} />
            <Route path="/products/rice" element={<Products category="rice" />} />
            <Route path="/products/spices" element={<Products category="spices" />} />
            <Route path="/products/pickles" element={<Products category="pickles" />} />
            <Route path="/checkout" element={authUser ? <Checkout /> : <Login />} />

            {/* Product Details */}
            <Route path="/product/:id" element={<ProductDetails />} />

            {/* Protected Account Routes */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="addresses" element={<PlaceholderPage title="Saved Addresses" />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="/account/admin/orders" element={<AdminOrders />} />
              <Route path="/account/admin/orders/:id" element={<AdminOrderDetails />} />
              <Route path="/account/admin/ambassadors" element={<AdminAmbassadors />} />
              <Route path="admin/products/:id/edit" element={<EditProduct />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="add-post" element={<AddPost />} />
              <Route path="add-hero-bg" element={<AdminHeroBanner />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

        <Footer />
        <Toaster />
      </div>
    </HashRouter>
    </>
  );
};

export default App;
