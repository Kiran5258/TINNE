import React, { useState, useEffect } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { IconUpload, IconClose } from '../components/Icons';
import { useCategoryStore, useProductStore } from '../services/useProductStore';
import toast from 'react-hot-toast';
import RichEditor from '@/components/RichEditor';

export const AddProduct: React.FC = () => {
  const addProduct = useProductStore((state) => state.addProduct);

  const [loading, setLoading] = useState(false);

  // Sizes array -> [{label, stock, price}]
  const [sizes, setSizes] = useState<{ label: string; stock: number; price: number }[]>([]);
  const [currentSize, setCurrentSize] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [currentSizePrice, setCurrentSizePrice] = useState('');

  // MULTIPLE IMAGES
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

  // Form fields
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('millets');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [description, setDescription] = useState('');

  const { categories, fetchCategories } = useCategoryStore();

  // ===========================
  // MULTIPLE IMAGE UPLOAD
  // ===========================
  const handleMultipleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setImagesPreview((prev) => prev.filter((_, i) => i !== idx));
  };

  // ===========================
  // SIZE ADD / REMOVE
  // ===========================
  const addSize = () => {
    if (!currentSize || !currentStock || !currentSizePrice) {
      toast.error("Enter size, stock and price");
      return;
    }

    setSizes([...sizes, { label: currentSize, stock: Number(currentStock), price: Number(currentSizePrice) }]);
    setCurrentSize('');
    setCurrentStock('');
    setCurrentSizePrice('');
  };

  const removeSize = (label: string) => {
    setSizes(sizes.filter((s) => s.label !== label));
  };

  // ===========================
  // SUBMIT FORM
  // ===========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (imagesPreview.length === 0)
      return toast.error("Please upload at least one image");

    if (sizes.length === 0)
      return toast.error("Add at least one size");

    setLoading(true);

    const data = {
      productName,
      description,
      price: Number(price),
      offerPrice: offerPrice ? Number(offerPrice) : undefined,
      sizes,
      category,
      images: imagesPreview, // MULTIPLE IMAGES SENT TO BACKEND
    };

    await addProduct(data);
    setLoading(false);

    // Reset Form
    setProductName("");
    setDescription("");
    setPrice("");
    setOfferPrice("");
    setSizes([]);
    setImagesPreview([]);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold font-display mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

        {/* Product Name + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product Name"
            required
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price */}
        <Input
          label="Price (₹)"
          type="number"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Offer Price */}
        <Input
          label="Offer Price (%)"
          type="number"
          value={offerPrice}
          onChange={(e) => setOfferPrice(e.target.value)}
        />

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Sizes & Stock
          </label>

          <div className="flex gap-3 mb-3">
            <Input
              placeholder="Size (e.g. 500g)"
              value={currentSize}
              onChange={(e) => setCurrentSize(e.target.value)}
            />
            <Input
              placeholder="Stock"
              type="number"
              value={currentStock}
              onChange={(e) => setCurrentStock(e.target.value)}
            />
            <Input
              placeholder="Price (₹)"
              type="number"
              value={currentSizePrice}
              onChange={(e) => setCurrentSizePrice(e.target.value)}
            />
            <Button type="button" onClick={addSize} variant="secondary">
              Add
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {sizes.map((s) => (
              <div
                key={s.label}
                className="bg-neutral-100 px-4 py-2 rounded-xl flex justify-between items-center"
              >
                <span>{s.label} — {s.stock} pcs — ₹{s.price}</span>
                <button onClick={() => removeSize(s.label)} className="text-red-500">
                  <IconClose />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <RichEditor
            value={description}
            onChange={(html) => setDescription(html)}
          />
        </div>

        {/* MULTIPLE IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-medium mb-2">Product Images</label>

          <div className="border-2 border-dashed rounded-xl p-8 text-center relative">
            <IconUpload className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-500">Click to upload multiple images</p>

            <input
              type="file"
              multiple
              onChange={handleMultipleImages}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* IMAGE PREVIEW GRID */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {imagesPreview.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} className="h-32 w-full object-cover rounded-lg" />

                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                >
                  <IconClose />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button type="submit" size="lg" className="w-full" isLoading={loading}>
          Save Product
        </Button>
      </form>
    </div>
  );
};
