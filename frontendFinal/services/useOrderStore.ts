import { create } from "zustand";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

// ----------------------
// TYPES
// ----------------------
interface OrderItem {
  productName: string;
  sizeLabel: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  user: {
    fullName: string;
    email: string;
  };
  items: OrderItem[];
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  codPending: number;
  monthly: any[];
}

interface OrderStore {
  orders: Order[];
  myOrders: Order[];
  stats: Stats | null;

  placeCODOrder(orderData: any): Promise<any>;
  createRazorpayOrder(orderData: any): Promise<any>;
  verifyRazorpayPayment(verifyData: any): Promise<any>;

  fetchUserOrders(): Promise<void>;
  fetchAdminOrders(): Promise<void>;
  fetchStats(): Promise<void>;

  getOrderById(id: string): Promise<Order | null>;
  getAdminOrderById?(id: string): Promise<Order | null>;
  updateOrderStatus?(id: string, status: string): Promise<Order | null>;
}

// ----------------------
// STORE
// ----------------------
export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  myOrders: [],
  salesChartData: [],
  orderStatusDist: [],
  stats: null,

  // =============================
  // USER → PLACE COD ORDER
  // =============================
  placeCODOrder: async (orderData) => {
    try {
      const res = await axiosInstance.post("/orders/cod", orderData);
      toast.success("Order placed successfully!");
      return res.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "COD Order failed");
      return null;
    }
  },

  // =============================
  // USER → CREATE RAZORPAY ORDER
  // =============================
  createRazorpayOrder: async (orderData) => {
    try {
      const res = await axiosInstance.post("/orders/razorpay", orderData);
      return res.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create Razorpay order");
      return null;
    }
  },

  // =============================
  // USER → VERIFY PAYMENT
  // =============================
  verifyRazorpayPayment: async (verifyData) => {
    try {
      const res = await axiosInstance.post("/orders/razorpay/verify", verifyData);
      toast.success("Payment verified successfully!");
      return res.data;
    } catch {
      toast.error("Payment verification failed");
      return null;
    }
  },

  // =============================
  // USER → GET MY ORDERS
  // =============================
  fetchUserOrders: async () => {
    try {
      const res = await axiosInstance.get("/orders/my");
      set({ myOrders: res.data.orders });
    } catch {
      toast.error("Failed to load your orders");
    }
  },

  // =============================
  // ADMIN → GET ALL ORDERS
  // =============================
  fetchAdminOrders: async () => {
    try {
      const res = await axiosInstance.get("/orders");
      set({ orders: res.data.orders });
    } catch {
      toast.error("Failed to load orders");
    }
  },

  // =============================
  // ADMIN → GET STATS
  // =============================
  fetchStats: async () => {
    try {
      const res = await axiosInstance.get("/orders/stats");
      set({ stats: res.data });
    } catch {
      toast.error("Failed to load stats");
    }
  },

  // =============================
  // USER → GET ORDER DETAILS
  // =============================
  getOrderById: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/orders/${id}`);
      return res.data.order;
    } catch {
      toast.error("Failed to load order details");
      return null;
    }
  },

  // =============================
  // ADMIN → GET SINGLE ORDER DETAILS
  // =============================
  getAdminOrderById: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/orders/admin/${id}`);
      return res.data.order;
    } catch {
      toast.error("Failed to load order");
      return null;
    }
  },

  // =============================
  // ADMIN → UPDATE ORDER STATUS
  // =============================
  updateOrderStatus: async (id: string, status: string) => {
    try {
      const res = await axiosInstance.put(`/orders/${id}/status`, { status });
      toast.success("Order status updated");
      return res.data.order;
    } catch {
      toast.error("Failed to update status");
      return null;
    }
  },
}));
