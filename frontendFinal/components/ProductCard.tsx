import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "../types";
import { Button } from "./Button";
import { IconBag, IconCheck, IconEdit } from "./Icons";
import { useCartStore } from "../services/useCartStore";
import { useAuthStore } from "@/services/useAuthStore";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  console.log(product);
  console.log(product.images[0]);
  const hasDiscount = product.offerPrice && product.offerPrice > 0;
  const discountedPrice = hasDiscount
    ? product.price - (product.price * product.offerPrice) / 100
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!authUser) {
      navigate("/login");
      return;
    }

    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border hover:shadow-lg flex flex-col">

      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="relative aspect-[4/3] block">
        <img
          src={
            (product.images && product.images.length > 0 ? product.images[0] : null) ||
            (typeof product.image === 'string' ? product.image : null) ||
            "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
          }
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
          }}
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
            {product.offerPrice}% OFF
          </span>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Category */}
        <span className="text-xs text-neutral-500 uppercase">{product.category}</span>

        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-bold mt-1 group-hover:text-brand-dark transition">
            {product.productName}
          </h3>
        </Link>

        {/* Description Preview */}
        <div
          className="prose prose-neutral max-w-none mb-6 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: product.description }}
        ></div>

        {/* Footer: Price + Cart/Edit */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t">

          {/* --- PRICE SECTION --- */}
          {hasDiscount ? (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-green-600">₹{discountedPrice}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm line-through text-neutral-500">₹{product.price}</span>
                <span className="text-green-600 text-xs font-semibold">{product.offerPrice}% OFF</span>
              </div>
            </div>
          ) : (
            <span className="text-xl font-bold">₹{product.price}</span>
          )}

          {/* --- ADMIN: SHOW EDIT BUTTON --- */}
          {authUser?.role === "admin" ? (
            <Button
              size="sm"
              className="!p-2.5"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/account/admin/products/${product._id}/edit`);
              }}
            >
              <IconEdit className="w-5 h-5" />
            </Button>
          ) : (
            // --- USER: ADD TO CART BUTTON ---
            <Button size="sm" onClick={handleAddToCart} className="!p-2.5">
              {added ? <IconCheck className="w-5 h-5" /> : <IconBag className="w-5 h-5" />}
            </Button>
          )}

        </div>
      </div>
    </article>
  );
};
