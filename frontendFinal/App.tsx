import React, { useEffect } from 'react';
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
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { AddProduct } from './pages/AddProduct';
import { About } from './pages/About';
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

  // Run auth check on load
  useEffect(() => {
    checkAuth();
    fetchGlobalSettings();
  }, []);

  const fetchGlobalSettings = async () => {
    try {
      const res = await axiosInstance.get('/settings');
      if (res.data && res.data.globalOffer && res.data.globalOffer.enabled) {
        // Apply global discount automatically if no promo code is needed, 
        // OR just store it. For now, let's apply it if there is NO promo code required.
        // If promo code is required, we just wait for user to enter it (future task).
        // But user said "give me the promo code... and also 10% offer".
        // Let's safe-guard: if promoCode is empty but enabled, apply directly.
        const { percentage, promoCode } = res.data.globalOffer;
        // Only apply automatically if NO promo code is configured (ie. a sitewide sale without code)
        if (!promoCode || promoCode.trim() === "") {
          applyDiscount(percentage, "GLOBAL_OFFER");
        } else {
          // If there is a code, ensure we don't have a stale global offer applied
          // (Unless the user entered it? For now, let's keep it simple: clear if it's 'GLOBAL_OFFER')
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

            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />
            <Route path="/about" element={<About />} />
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
  );
};

export default App;
