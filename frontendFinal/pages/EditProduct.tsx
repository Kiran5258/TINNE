import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "../components/Button";
import RichEditor from "../components/RichEditor";

import { useProductStore } from "@/services/useProductStore";
import { IconCancel, IconPlus } from "@/components/Icons";

const EditProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getProduct, updateProduct } = useProductStore();

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    const data = await getProduct(id!);
    if (data) {
      setProduct(data);
      setPreviewImages(data.images || []);
    }
  };

  // ---------------------------------------------------
  // MULTI IMAGE UPLOAD HANDLER
  // ---------------------------------------------------
  const handleImages = (e: any) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return; // prevent crash

    for (let file of files) {
      if (!(file instanceof Blob)) {
        console.error("Invalid file:", file);
        continue;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;

        setProduct((prev: any) => ({
          ...prev,
          images: [...(prev.images || []), base64Image],
        }));

        setPreviewImages((prevList) => [...prevList, base64Image]);
      };

      reader.readAsDataURL(file);
    }
  };


  // ---------------------------------------------------
  // SIZE HANDLERS
  // ---------------------------------------------------
  const handleSizeChange = (idx: number, field: string, value: any) => {
    const updated = [...product.sizes];
    updated[idx][field] = value;
    setProduct({ ...product, sizes: updated });
  };

  const addSize = () => {
    setProduct({
      ...product,
      sizes: [...product.sizes, { label: "", stock: 0, price: 0 }],
    });
  };

  const removeSize = (idx: number) => {
    setProduct({
      ...product,
      sizes: product.sizes.filter((_: any, i: number) => i !== idx),
    });
  };

  // ---------------------------------------------------
  // SUBMIT UPDATED PRODUCT
  // ---------------------------------------------------
  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      productName: product.productName,
      description: product.description,
      price: product.price,
      offerPrice: product.offerPrice,
      category: product.category,
      sizes: product.sizes,
      images: product.images, //  MULTIPLE IMAGES
    };

    const updated = await updateProduct(id!, payload);

    setLoading(false);
    if (updated) navigate("/account/admin/products");
  };

  if (!product) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-display font-bold mb-6">Edit Product</h1>

      <div className="space-y-6">

        {/* NAME */}
        <div>
          <label className="font-semibold">Product Name</label>
          <input
            className="border w-full p-3 rounded-lg mt-1"
            value={product.productName}
            onChange={(e) =>
              setProduct({ ...product, productName: e.target.value })
            }
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-semibold">Description</label>
          <RichEditor
            value={product.description}
            onChange={(html) => setProduct({ ...product, description: html })}
          />

          <label className="font-semibold mt-4 block">Preview</label>
          <div
            className="prose max-w-none border p-4 rounded-lg bg-white"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
        </div>

        {/* PRICE & OFFER */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Price (₹)</label>
            <input
              type="number"
              className="border w-full p-3 rounded-lg mt-1"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="font-semibold">Discount (%)</label>
            <input
              type="number"
              className="border w-full p-3 rounded-lg mt-1"
              value={product.offerPrice}
              onChange={(e) =>
                setProduct({ ...product, offerPrice: Number(e.target.value) })
              }
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="font-semibold">Category</label>
          <input
            className="border w-full p-3 rounded-lg mt-1"
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
          />
        </div>

        {/* SIZES */}
        <div>
          <label className="font-semibold">Sizes & Stock</label>

          <div className="space-y-3 mt-3">
            {product.sizes.map((s: any, idx: number) => (
              <div key={idx} className="flex gap-3">

                <input
                  className="border p-3 rounded-lg w-full"
                  placeholder="Label (e.g., 500g)"
                  value={s.label}
                  onChange={(e) =>
                    handleSizeChange(idx, "label", e.target.value)
                  }
                />

                <input
                  type="number"
                  className="border p-3 rounded-lg w-full"
                  placeholder="Stock"
                  value={s.stock}
                  onChange={(e) =>
                    handleSizeChange(idx, "stock", Number(e.target.value))
                  }
                />

                <input
                  type="number"
                  className="border p-3 rounded-lg w-full"
                  placeholder="Price (₹)"
                  value={s.price}
                  onChange={(e) =>
                    handleSizeChange(idx, "price", Number(e.target.value))
                  }
                />

                <button
                  onClick={() => removeSize(idx)}
                  className="px-3 bg-red-500 text-white rounded-lg"
                >
                  <IconCancel />
                </button>

              </div>
            ))}

            <button
              onClick={addSize}
              className="px-4 py-2 bg-neutral-200 rounded-lg flex items-center gap-2"
            >
              <IconPlus /> Add Size
            </button>
          </div>
        </div>

        {/* MULTIPLE IMAGE UPLOAD */}
        <div>
          <label className="font-semibold">Product Images</label>
          <input type="file" multiple onChange={handleImages} className="mt-2" />

          <div className="mt-4 grid grid-cols-3 gap-4">
            {previewImages.map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                className="w-32 h-32 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <Button
          onClick={handleSubmit}
          isLoading={loading}
          className="mt-6"
        >
          Update Product
        </Button>

      </div>
    </div>
  );
};

export default EditProduct;
