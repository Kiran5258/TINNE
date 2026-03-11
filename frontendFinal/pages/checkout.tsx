import React, { useState, useEffect } from "react";
import { useCartStore } from "../services/useCartStore";
import { useOrderStore } from "../services/useOrderStore";
import { useAuthStore } from "../services/useAuthStore";
import { Button } from "../components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const { items, clearCart } = useCartStore();
  const { createRazorpayOrder, verifyRazorpayPayment, placeCODOrder } =
    useOrderStore();

  const user = useAuthStore((s) => s.authUser);

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address1: "",
    state: "",
    district: "",
    pincode: "",
  });

  // ------------------------------------------
  // AUTO-FILL PRIMARY ADDRESS
  // ------------------------------------------
  useEffect(() => {
    if (!user) return;

    const primary =
      user.addresses?.find((a) => a.isPrimary) ||
      user.addresses?.[0] ||
      null;

    setShipping({
      fullName: user.fullName || "",
      phone: user.phoneNo || "",
      address1: primary?.address1 || "",
      state: primary?.state || "",
      district: primary?.district || "",
      pincode: primary?.pincode || "",
    });
  }, [user]);

  // INPUT HANDLER
  const handleInput = (e: any) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  // VALIDATION
  const validateShipping = () => {
    for (const field in shipping) {
      if (!shipping[field as keyof typeof shipping]) {
        toast.error("Please fill all required fields");
        return false;
      }
    }
    return true;
  };

  // ------------------------------------------
  // CORRECT SUBTOTAL (discount already applied)
  // ------------------------------------------
  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // ------------------------------------------
  // COD ORDER
  // ------------------------------------------
  const handleCOD = async () => {
    if (!validateShipping()) return;

    const orderData = {
      items: items.map((i) => ({
        productId: i.id,
        sizeLabel: i.selectedSize,
        quantity: i.quantity,
      })),
      shippingAddress: { ...shipping },
    };

    const res = await placeCODOrder(orderData);

    if (res) {
      toast.success("Order placed with Cash on Delivery!");
      navigate("/order");
      setTimeout(() => clearCart(), 300);
    }
  };

  // ------------------------------------------
  // RAZORPAY SCRIPT LOADER
  // ------------------------------------------
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });

  // ------------------------------------------
  // RAZORPAY PAYMENT
  // ------------------------------------------
  const handleRazorpayPayment = async () => {
    if (!validateShipping()) return;

    setIsProcessing(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay");
      setIsProcessing(false);
      return;
    }

    const backendOrder = await createRazorpayOrder({
      items: items.map((i) => ({
        productId: i.id,
        sizeLabel: i.selectedSize,
        quantity: i.quantity,
      })),
      shippingAddress: { ...shipping },
    });

    if (!backendOrder) {
      setIsProcessing(false);
      return;
    }
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    const options: any = {
      key: razorpayKey,
      amount: backendOrder.razorpayOrder.amount,
      currency: backendOrder.razorpayOrder.currency,
      name: "Tinne Organics",
      description: "Order Payment",
      order_id: backendOrder.razorpayOrder.id,
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      },

      handler: async (response: any) => {
        const verify = await verifyRazorpayPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: backendOrder.orderId,
        });

        if (verify) {
          toast.success("Payment Successful!");
          navigate("/order");
          setTimeout(() => clearCart(), 300);
        }
        setIsProcessing(false);
      },
    };
    console.log("Razorpay Key:", razorpayKey);

    new (window as any).Razorpay(options).open();
  };
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-6">
      <h1 className="text-4xl font-display font-bold mb-6">Checkout</h1>

      {/* SHIPPING FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(shipping).map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              value={(shipping as any)[field]}
              onChange={handleInput}
              required
              className="border px-4 py-3 rounded-lg w-full"
            />
          ))}
        </div>
      </div>

      {/* PAYMENT SECTION */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Payment</h2>

        <p className="text-lg mb-6">
          Total Payable:{" "}
          <span className="font-bold">₹{subtotal.toFixed(2)}</span>
        </p>

        <div className="flex gap-4">
          {/* <Button size="lg" onClick={handleCOD}>
            Cash on Delivery
          </Button> */}

          <Button
            size="lg"
            variant="primary"
            onClick={handleRazorpayPayment}
            disabled={isProcessing}
            className={`min-w-[150px] flex justify-center items-center ${isProcessing ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Pay Now"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
