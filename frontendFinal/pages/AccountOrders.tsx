import React, { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios";
import { IconBox } from "../components/Icons";
import { Link } from "react-router-dom";

export const AccountOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get("/orders/my"); 
        setOrders(res.data.orders); 
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-neutral-500">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="p-10 text-center">
        <IconBox className="w-10 h-10 mx-auto text-neutral-300 mb-4" />
        <h2 className="text-xl font-bold">No Orders Yet</h2>
        <p className="text-neutral-500 text-sm mt-2">
          When you place an order, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Link
            to={`/account/orders/${order._id}`}
            key={order._id}
            className="block border rounded-xl p-6 bg-neutral-50 hover:bg-neutral-100 transition"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">Order #{order._id.slice(-6)}</h3>
                <p className="text-neutral-500 text-sm">{order.createdAt.slice(0, 10)}</p>
              </div>

              <span className="text-green-600 font-bold capitalize">
                {order.orderStatus}
              </span>
            </div>

            <div className="mt-4 text-sm text-neutral-600">
              {order.items.length} item(s) • ₹{order.totalAmount}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
