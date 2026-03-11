import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrderStore } from "../services/useOrderStore";

export const AdminOrderDetails: React.FC = () => {
  const { id } = useParams();
  const getAdminOrderById = useOrderStore((s) => s.getAdminOrderById);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getAdminOrderById(id!);
      setOrder(data);
    };
    load();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    const updated = await updateOrderStatus(id!, status);
    if (updated) setOrder(updated);
  };

  const handleDownloadInvoice = () => {
    window.open(
      `http://localhost:5000/api/admin/orders/${id}/invoice`,
      "_blank"
    );
  };

  if (!order) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{order._id.slice(-6)}</h1>

        {/* 📄 Download Invoice Button */}
        <button
          onClick={handleDownloadInvoice}
          className="px-6 py-3 bg-brand-dark text-white rounded-lg transition"
        >
          Download Invoice (PDF)
        </button>
      </div>

      {/* User Info */}
      <div className="p-6 bg-neutral-50 rounded-xl border">
        <h2 className="font-bold text-lg mb-4">Customer</h2>
        <p>{order.user.fullName}</p>
        <p className="text-sm text-neutral-600">{order.user.email}</p>
        <p className="mt-2 text-sm text-neutral-500">
          {order.shippingAddress.address1}, {order.shippingAddress.district}
        </p>
      </div>

      {/* Payment Info */}
      <div className="p-6 bg-neutral-50 rounded-xl border">
        <h2 className="font-bold text-lg mb-4">Payment Details</h2>
        <p>Method: <span className="capitalize">{order.paymentMethod}</span></p>
        <p>Status: <span className="capitalize">{order.paymentStatus}</span></p>
        {order.razorpayPaymentId && (
          <p>Ref: <span className="font-mono text-sm">{order.razorpayPaymentId}</span></p>
        )}
      </div>

      {/* Items */}
      <div className="p-6 bg-neutral-50 rounded-xl border">
        <h2 className="font-bold text-lg mb-4">Items</h2>
        {order.items.map((item: any, index: number) => (
          <div key={index} className="flex justify-between py-2 border-b">
            <span>
              {item.productName} ({item.sizeLabel}) × {item.quantity}
            </span>
            <span>₹{Number(item.subtotal).toFixed(2)}</span>
          </div>
        ))}

        <div className="flex justify-between font-bold text-lg pt-4">
          <span>Total</span>
          <span>₹{Number(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>

      {/* Status Update */}
      <div className="p-6 bg-neutral-50 rounded-xl border">
        <h2 className="font-bold text-lg mb-4">Order Status</h2>

        <select
          value={order.orderStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="p-3 border rounded-xl bg-white"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};
