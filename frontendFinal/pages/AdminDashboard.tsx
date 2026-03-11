import React, { useEffect, useState } from 'react';
import { useProductStore } from '../services/useProductStore';
import { useOrderStore } from '../services/useOrderStore';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import {
  IconTrendingUp,
  IconDollarSign,
  IconBox,
  IconTrash,
  IconPlus,
  IconSettings
} from '../components/Icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { axiosInstance } from '../config/axios';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const { products, deleteProduct } = useProductStore();
  const { orders, stats, fetchAdminOrders, fetchStats } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'settings'>('overview');

  // Settings State
  const [settings, setSettings] = useState({
    globalOffer: { enabled: false, percentage: 0, promoCode: '' },
    popup: { enabled: false, title: '', message: '', image: '' }
  });

  useEffect(() => {
    fetchAdminOrders();
    fetchStats();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosInstance.get('/settings');
      if (res.data) setSettings(res.data);
    } catch (error) {
      console.error("Error fetching settings", error);
    }
  };

  const saveSettings = async () => {
    try {
      await axiosInstance.put('/settings', settings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="text-neutral-500">Manage your store, view analytics, and configure settings.</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'overview' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('overview')}
            size="sm"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'products' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('products')}
            size="sm"
          >
            Products
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('settings')}
            size="sm"
            className="flex items-center"
          >
            <IconSettings className="w-4 h-4 mr-2" /> Settings
          </Button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  <IconDollarSign className="w-6 h-6" />
                </div>
              </div>
              <p className="text-neutral-500 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-display font-bold text-neutral-900">
                ₹{stats?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <IconBox className="w-6 h-6" />
                </div>
              </div>
              <p className="text-neutral-500 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-display font-bold text-neutral-900">
                {stats?.totalOrders || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                  <IconTrendingUp className="w-6 h-6" />
                </div>
              </div>
              <p className="text-neutral-500 text-sm mb-1">Active Products</p>
              <p className="text-3xl font-display font-bold text-neutral-900">{products.length}</p>
            </div>
          </div>

          {/* CHARTS */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="text-lg font-bold mb-6">Sales Trends (Last 7 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.salesChartData || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="text-lg font-bold mb-6">Order Status Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.orderStatusDist || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div> */}

          {/* RECENT SALES */}
          <div>
            <h2 className="text-xl font-display font-bold mb-6">Recent Orders</h2>
            <div className="bg-white rounded-2xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-500 border-b">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 font-bold">{o._id}</td>
                      <td className="px-6 py-4">{o.user.fullName}</td>
                      <td className="px-6 py-4 font-bold">₹{o.totalAmount}</td>
                      <td className="px-6 py-4">{o.paymentMethod}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold">Product Management</h2>
            <Link to="/account/add-product">
              <Button size="sm" className="flex items-center">
                <IconPlus className="w-4 h-4 mr-2" /> Add Product
              </Button>
            </Link>
          </div>
          <div className="bg-white rounded-2xl border overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-neutral-500 border-b">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-3">
                      <img src={p.images[0]} className="w-12 h-12 rounded object-cover" />
                    </td>
                    <td className="px-6 py-3 font-bold">{p.productName}</td>
                    <td className="px-6 py-3">{p.category}</td>
                    <td className="px-6 py-3">₹{p.price}</td>
                    <td className="px-6 py-3">{p.stocks}</td>
                    <td className="px-6 py-3 text-right">
                      <button className="p-2 text-neutral-400 hover:text-red-500" onClick={() => handleDelete(p._id)}>
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-fade-in max-w-3xl">
          <h2 className="text-xl font-display font-bold mb-6">Store Configuration</h2>

          {/* GLOBAL OFFER */}
          <div className="bg-white p-6 rounded-2xl border mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Global Offer / Promo Code</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.globalOffer?.enabled}
                  onChange={(e) => setSettings({ ...settings, globalOffer: { ...settings.globalOffer, enabled: e.target.checked } })}
                  className="w-5 h-5 accent-brand-accent cursor-pointer"
                />
                <span className="ml-2 text-sm text-neutral-600">Enable</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Percentage Discount (%)</label>
                <input
                  type="number"
                  value={settings.globalOffer?.percentage}
                  onChange={(e) => setSettings({ ...settings, globalOffer: { ...settings.globalOffer, percentage: Number(e.target.value) } })}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Promo Code</label>
                <input
                  type="text"
                  value={settings.globalOffer?.promoCode}
                  onChange={(e) => setSettings({ ...settings, globalOffer: { ...settings.globalOffer, promoCode: e.target.value } })}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. WELCOME10"
                />
              </div>
            </div>
          </div>

          {/* POPUP SETTINGS */}
          <div className="bg-white p-6 rounded-2xl border mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Promotional Popup</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.popup?.enabled}
                  onChange={(e) => setSettings({ ...settings, popup: { ...settings.popup, enabled: e.target.checked } })}
                  className="w-5 h-5 accent-brand-accent cursor-pointer"
                />
                <span className="ml-2 text-sm text-neutral-600">Enable</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Popup Title</label>
                <input
                  type="text"
                  value={settings.popup?.title}
                  onChange={(e) => setSettings({ ...settings, popup: { ...settings.popup, title: e.target.value } })}
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. Special Offer!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={settings.popup?.message}
                  onChange={(e) => setSettings({ ...settings, popup: { ...settings.popup, message: e.target.value } })}
                  className="w-full border rounded-lg p-2 h-24"
                  placeholder="e.g. Get 20% off on your first order."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  value={settings.popup?.image}
                  onChange={(e) => setSettings({ ...settings, popup: { ...settings.popup, image: e.target.value } })}
                  className="w-full border rounded-lg p-2"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <Button size="lg" onClick={saveSettings}>Save Changes</Button>

        </div>
      )}

    </div>
  );
};
