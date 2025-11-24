import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Products from "./pages/Products";
import About from "./pages/About";
import Signup from "./pages/Dashboard/Signup";
import Login from "./pages/Dashboard/Login";
import Account from "./pages/Dashboard/Account";
import { Toaster } from "react-hot-toast";

import Millet from "./pages/products/Milet";
import Nuts from "./pages/products/Nuts";
import Pickles from "./pages/products/Pickles";
import Spices from "./pages/products/Spices";

import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuth from "./components/RedirectIfAuth";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import Addresses from "./pages/Dashboard/Address";
import { Loader } from "lucide-react";
import Footer from "./components/Footer";
import AddProduct from "./components/AddProduct";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const {authUser}=useAuthStore();
  useEffect(() => {
    checkAuth();
  }, []);

  // Show loader until auth status known
  if (isCheckingAuth) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/millet" element={<Millet />} />
        <Route path="/products/nuts" element={<Nuts />} />
        <Route path="/products/pickles" element={<Pickles />} />
        <Route path="/products/spices" element={<Spices />} />
        <Route path="/about" element={<About />} />

        {/* GUEST ONLY */}
        <Route
          path="/signup"
          element={
            <RedirectIfAuth>
              <Signup />
            </RedirectIfAuth>
          }
        />

        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          }
        />

        {/* PROTECTED */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account/addresses"
          element={
            <ProtectedRoute>
              <Addresses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account/add-product"
          element={
            authUser?.isAdmin ? <AddProduct /> : <Navigate to="/account" />
          }
        />

      </Routes>

      <Footer />
      <Toaster />
    </>
  );
}

export default App;
