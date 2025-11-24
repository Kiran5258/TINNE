import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import axios from "axios";
import ImageUpload from "../components/ImageUpload";
import SizeChips from "../components/SizeChips";
import { useAuthStore } from "../store/useAuthStore";

export default function AddProduct() {
  const { authUser } = useAuthStore();
  // redirect non-admin
  if (!authUser) return <Navigate to="/login" replace />;
  if (!authUser.isAdmin) return <Navigate to="/account" replace />;

  const [form, setForm] = useState({
    productName: "",
    price: "",
    offerPrice: "",
    category: "",
    stocks: "",
  });
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState(["500g", "1kg"]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // fetch categories (optional)
    axios.get("/api/categories").then(res => setCategories(res.data.categories || []))
      .catch(() => setCategories(["Grocery","Electronics","Clothing"]));
  }, []);

  const handleFileChange = (f) => setFile(f);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload an image");

    const data = new FormData();
    data.append("productName", form.productName);
    data.append("description", description);
    data.append("price", form.price);
    data.append("offerPrice", form.offerPrice);
    data.append("category", form.category);
    data.append("stocks", form.stocks);
    data.append("size", JSON.stringify(sizes));
    data.append("image", file);

    try {
      const res = await axios.post("/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      alert("Product created");
      // reset
      setForm({ productName: "", price: "", offerPrice: "", category: "", stocks: "" });
      setDescription("");
      setSizes([]);
      setFile(null);
      setPreviewUrl(null);
      setUploadProgress(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
      setUploadProgress(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h3 className="font-bold text-xl mb-4">Admin</h3>
        <nav className="space-y-3 text-sm">
          <a href="/account" className="block">Dashboard</a>
          <a href="/account/products" className="block">Products</a>
          <a href="/account/add-product" className="block font-semibold">Add Product</a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-12 gap-6">
            {/* Left column */}
            <div className="col-span-7">
              <label className="block mb-2">Product Name</label>
              <input required name="productName" value={form.productName} onChange={handleChange}
                className="w-full border p-2 rounded mb-4" />

              <label className="block mb-2">Description</label>
              <SunEditor
                setOptions={{
                  height: 250,
                  buttonList: [
                    ["formatBlock","bold","italic","underline","strike"],
                    ["fontColor","hiliteColor","align","list","table"],
                    ["link","image","removeFormat","fullScreen"]
                  ]
                }}
                onChange={(content) => setDescription(content)}
                setContents={description}
              />

              <div className="mt-4">
                <label className="block mb-2">Sizes</label>
                <SizeChips sizes={sizes} setSizes={setSizes} />
              </div>
            </div>

            {/* Right column */}
            <div className="col-span-5">
              <div className="mb-4">
                <label className="block mb-2">Category</label>
                <select name="category" required value={form.category} onChange={handleChange} className="w-full border p-2 rounded">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-2">Price</label>
                  <input required name="price" value={form.price} onChange={handleChange} type="number" className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-2">Offer Price</label>
                  <input required name="offerPrice" value={form.offerPrice} onChange={handleChange} type="number" className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Stocks</label>
                <input required name="stocks" value={form.stocks} onChange={handleChange} type="number" className="w-full border p-2 rounded" />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Product Image</label>
                <ImageUpload
                  onFileChange={handleFileChange}
                  uploadProgress={uploadProgress}
                  previewUrl={previewUrl}
                  setPreviewUrl={setPreviewUrl}
                />
              </div>

              <div className="mt-4">
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Create Product</button>
              </div>

              {uploadProgress != null && (
                <div className="mt-3 text-sm">Upload progress: {uploadProgress}%</div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
