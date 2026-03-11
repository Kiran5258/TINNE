import React, { useEffect } from "react";
import { useOrderStore } from "../services/useOrderStore";
import { Link } from "react-router-dom";

export const AdminOrders: React.FC = () => {
  const orders = useOrderStore((s) => s.orders);
  const fetchAdminOrders = useOrderStore((s) => s.fetchAdminOrders);

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            to={`/account/admin/orders/${order._id}`}
            key={order._id}
            className="block p-5 border rounded-xl bg-neutral-50 hover:bg-neutral-100 transition"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-bold">Order #{order._id.slice(-6)}</p>
                <p className="text-sm text-neutral-500">
                  {order.user.fullName} • {order.user.email}
                </p>
                <p className="text-sm text-neutral-500">
                  {order.items.length} items • ₹{order.totalAmount}
                </p>
              </div>

              <span className="capitalize font-semibold text-brand-dark">
                {order.orderStatus}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
