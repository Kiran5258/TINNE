import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../services/useCartStore";
import { Button } from "../components/Button";
import {
  IconTrash,
  IconArrowRight,
  IconMinus,
  IconPlus,
  IconBag,
} from "../components/Icons";
import { axiosInstance } from "@/config/axios";

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } =
    useCartStore();
  console.log(items);
  // Helper: correct size key
  const getSizeKey = (item: any) =>
    typeof item.selectedSize === "string"
      ? item.selectedSize
      : item.selectedSize?.label;

  // If no items in cart
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white pt-20 px-6">
        <div className="w-24 h-24 bg-brand-muted rounded-full flex items-center justify-center mb-6 text-brand-dark/50">
          <IconBag className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-display font-bold">Your Bag is Empty</h1>
        <p className="text-neutral-500 mb-8 max-w-md text-center">
          It looks like you haven't added any items to your cart yet.
        </p>

        <Link to="/products">
          <Button variant="primary" size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  // Promo Code State
  const [promoCode, setPromoCode] = React.useState("");
  const [promoError, setPromoError] = React.useState("");
  const [promoSuccess, setPromoSuccess] = React.useState("");
  const { applyDiscount, removeDiscount, discount, appliedCode } = useCartStore(); // Ensure these are exported from useCartStore

  const handleApplyPromo = async () => {
    setPromoError("");
    setPromoSuccess("");

    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    try {
      const res = await axiosInstance.get('/settings'); // Replace with axiosInstance later if needed, direct for now to match file style or use instance if imported

      if (res.data && res.data.globalOffer && res.data.globalOffer.enabled) {
        const { percentage, promoCode: validCode } = res.data.globalOffer;
        if (validCode && validCode.toLowerCase() === promoCode.toLowerCase()) {
          applyDiscount(percentage, validCode);
          setPromoSuccess(`Promo applied! ${percentage}% off.`);
        } else {
          setPromoError("Invalid promo code");
          removeDiscount();
        }
      } else {
        setPromoError("No active promotions");
      }
    } catch (err) {
      setPromoError("Failed to validate code");
    }
  };

  // Totals
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0); // Recalculate raw subtotal for display
  const discountAmount = (subtotal * (discount || 0)) / 100;
  const shipping = 0;
  const total = subtotal - discountAmount + shipping;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-3xl lg:text-3xl font-display font-bold mb-8 flex items-baseline flex-wrap gap-2">
          <span>Shopping Bag</span>
          <span className="text-neutral-400 text-xl font-normal">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item: any) => {
              const sizeKey = getSizeKey(item);

              // ✔ Correct price values from Zustand
              const finalPrice = item.price;            // discounted
              const originalPrice = item.originalPrice; // actual price

              return (
                <div
                  key={`${item.id}-${sizeKey}`}
                  className="bg-white p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-row gap-4 sm:gap-6"
                >

                  {/* IMAGE */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-neutral-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={
                        (item.images && item.images.length > 0 ? item.images[0] : null) ||
                        item.image ||
                        "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow flex flex-col">
                    {/* HEADER: Category & Name */}
                    <div className="mb-2">
                      <p className="text-xs text-brand-accent uppercase tracking-wide mb-1">
                        {item.category}
                      </p>
                      <h3 className="text-lg sm:text-xl font-display font-bold leading-tight">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-neutral-500 mt-1">
                        Size: {sizeKey}
                      </p>
                    </div>

                    {/* PRICE ROW */}
                    <div className="flex items-baseline flex-wrap gap-2 mb-4">
                      <span className="text-lg sm:text-xl font-bold text-green-700">
                        ₹{(finalPrice * item.quantity).toFixed(2)}
                      </span>
                      {item.offerPrice > 0 && (
                        <>
                          <span className="line-through text-neutral-400 text-sm">
                            ₹{(originalPrice * item.quantity).toFixed(2)}
                          </span>
                          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            {item.offerPrice}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {/* FOOTER: Quantity & Remove (Flex Row) */}
                    <div className="flex justify-between items-center mt-auto">
                      {/* Quantity */}
                      <div className="flex items-center border rounded-full px-3 py-1 bg-neutral-50">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, sizeKey, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-1 text-neutral-600 hover:text-brand-dark"
                        >
                          <IconMinus className="w-4 h-4" />
                        </button>

                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, sizeKey, item.quantity + 1)
                          }
                          className="p-1 text-neutral-600 hover:text-brand-dark"
                        >
                          <IconPlus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button (Moved here) */}
                      <button
                        onClick={() => removeItem(item.id, sizeKey)}
                        className="text-neutral-400 hover:text-red-500 flex items-center text-sm font-medium transition-colors"
                      >
                        <IconTrash className="w-4 h-4 mr-1" /> Remove
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Continue + Clear */}
            <div className="flex justify-between items-center pt-4">
              <Link to="/products" className="text-sm font-medium text-brand-dark flex items-center">
                <IconArrowRight className="w-4 h-4 mr-2 rotate-180" /> Continue Shopping
              </Link>

              <button onClick={clearCart} className="text-sm text-neutral-400 hover:text-neutral-900">
                Clear Cart
              </button>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl border sticky top-28">
              <h2 className="text-2xl font-display font-bold mb-6">Order Summary</h2>

              {/* Promo Code Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  />
                  <Button size="sm" onClick={handleApplyPromo} className="whitespace-nowrap">Apply</Button>
                </div>
                {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                {promoSuccess && <p className="text-green-600 text-xs mt-1">{promoSuccess}</p>}
                {appliedCode && <p className="text-green-600 text-xs mt-1 font-bold">Applied: {appliedCode}</p>}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
              </div>

              <div className="border-t pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-display font-bold text-brand-dark">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className={`w-full flex items-center justify-center group ${isCheckingOut ? "opacity-90 cursor-wait" : ""}`}
                disabled={isCheckingOut}
                onClick={() => {
                  setIsCheckingOut(true);
                  setTimeout(() => navigate("/checkout"), 600);
                }}
              >
                {isCheckingOut ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span>Proceed to Checkout</span>
                    <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </div>
                )}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
