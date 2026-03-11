import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrderStore } from "../services/useOrderStore";
import { IconArrowRight } from "../components/Icons";

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const getOrderById = useOrderStore((s) => s.getOrderById);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getOrderById(id!);
      setOrder(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="p-10">Loading…</div>;
  if (!order)
    return (
      <div className="p-10 text-center">
        Order not found.
        <Link className="text-blue-500 underline" to="/account/orders">
          Go Back
        </Link>
      </div>
    );

  return (
    <div className="p-10 space-y-8">

      <Link to="/account/orders" className="text-sm flex items-center text-brand-dark">
        <IconArrowRight className="rotate-180 w-4 h-4 mr-2" />
        Back
      </Link>

      <h1 className="text-2xl font-bold">
        Order #{order._id.slice(-6)}
      </h1>

      <div className="bg-neutral-50 p-6 rounded-xl border">
        <h2 className="text-xl font-bold mb-4">Items</h2>

        {order.items.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between border-b py-3">
            <div>
              <p className="font-semibold">{item.productName}</p>
              <p className="text-neutral-500 text-sm">
                Size: {item.sizeLabel} • Qty: {item.quantity}
              </p>
            </div>
            <p className="font-semibold">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}

        <div className="pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{Number(order.totalAmount).toFixed(2)}</span>
        </div>

      </div>

      <div className="bg-neutral-50 p-6 rounded-xl border">
        <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
        <p>
          {order.shippingAddress.fullName} <br />
          {order.shippingAddress.address1} <br />
          {order.shippingAddress.address2 && (
            <>
              {order.shippingAddress.address2}
              <br />
            </>
          )}
          {order.shippingAddress.district}, {order.shippingAddress.state}{" "}
          - {order.shippingAddress.pincode}
          <br />
          Phone: {order.shippingAddress.phone}
        </p>
      </div>
    </div>
  );
};
