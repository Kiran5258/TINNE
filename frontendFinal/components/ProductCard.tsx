import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "../types";
import { IconBag, IconCheck, IconEdit } from "./Icons";
import { useCartStore } from "../services/useCartStore";
import { useAuthStore } from "@/services/useAuthStore";

interface ProductCardProps {
  product: Product;
}

// Custom SVGs for card highlights
const LeafIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z" />
    <path d="M9 22v-4" />
  </svg>
);

const ShieldIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const HeartIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SparklesIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3v1M12 20v1M3 12h1M20 12h1M18.36 5.64l-.7.7M6.34 17.66l-.7.7M18.36 18.36l-.7-.7M6.34 6.34l-.7-.7" />
  </svg>
);

const StarIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const stripHtml = (htmlString: string) => {
  if (!htmlString) return "";
  return htmlString.replace(/<[^>]*>/g, "");
};

const getCategoryHighlights = (category: string) => {
  const cat = category ? category.toLowerCase() : "";
  if (cat.includes("millet")) {
    return [
      { text: "Rich in Iron", icon: <LeafIcon className="w-3 h-3 text-[#2E5E35]" /> },
      { text: "Immunity Booster", icon: <ShieldIcon className="w-3 h-3 text-[#2E5E35]" /> }
    ];
  }
  if (cat.includes("spice") || cat.includes("podi") || cat.includes("pickle")) {
    return [
      { text: "Rich Aroma", icon: <SparklesIcon className="w-3 h-3 text-[#2E5E35]" /> },
      { text: "Traditional", icon: <LeafIcon className="w-3 h-3 text-[#2E5E35]" /> }
    ];
  }
  if (cat.includes("nut") || cat.includes("seed")) {
    return [
      { text: "High Protein", icon: <HeartIcon className="w-3 h-3 text-[#2E5E35]" /> },
      { text: "Good for Skin", icon: <StarIcon className="w-3 h-3 text-[#2E5E35]" /> }
    ];
  }
  if (cat.includes("rice")) {
    return [
      { text: "Organic Grain", icon: <LeafIcon className="w-3 h-3 text-[#2E5E35]" /> },
      { text: "Traditional", icon: <ShieldIcon className="w-3 h-3 text-[#2E5E35]" /> }
    ];
  }
  return [
    { text: "100% Organic", icon: <LeafIcon className="w-3 h-3 text-[#2E5E35]" /> },
    { text: "Grandma Made", icon: <HeartIcon className="w-3 h-3 text-[#2E5E35]" /> }
  ];
};

const getCategoryTagline = (category: string) => {
  const cat = category ? category.toLowerCase() : "";
  if (cat.includes("millet")) return "Nutrient rich.";
  if (cat.includes("spice")) return "Pure & aromatic.";
  if (cat.includes("nut")) return "Healthy fats.";
  if (cat.includes("rice")) return "Naturally healthy.";
  if (cat.includes("pickle")) return "Tangy & spicy.";
  return "Naturally powerful.";
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

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

  const plainDesc = stripHtml(product.description);
  const highlights = getCategoryHighlights(product.category);
  const tagline = getCategoryTagline(product.category);

  // Fallback product image
  const productImage = (product.images && product.images.length > 0 ? product.images[0] : null) ||
    (typeof product.image === "string" ? product.image : null) ||
    "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

  return (
    <Link to={`/product/${product._id}`} className="group bg-[#FCFBF8] border border-amber-900/10 hover:shadow-md transition-shadow rounded-2xl p-4 flex items-center space-x-4 relative h-full block">
      
      {/* Discount Badge on the left image box */}
      {hasDiscount && (
        <span className="absolute top-2 left-2 bg-[#EAB308] text-[#1C2E1A] text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow z-10 uppercase tracking-wider">
          {product.offerPrice}% OFF
        </span>
      )}

      {/* Left: Product Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-white border border-neutral-100 rounded-xl overflow-hidden flex items-center justify-center p-1.5 relative shadow-sm">
        <img
          src={productImage}
          alt={product.productName}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.04)] group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
          }}
        />
      </div>

      {/* Right: Card Content */}
      <div className="flex-grow flex flex-col justify-between min-w-0 h-full py-1">
        <div>
          {/* Tagline */}
          <span className="text-[10px] font-bold text-[#2E5E35] tracking-widest uppercase block mb-0.5">{tagline}</span>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-display font-extrabold text-[#1C2E1A] leading-snug line-clamp-1 group-hover:text-[#2E5E35] transition-colors">
            {product.productName}
          </h3>

          {/* Description */}
          <p className="text-[11px] text-[#6A6A6A] font-light line-clamp-1 mt-0.5 mb-1.5">
            {plainDesc || "Premium product sourced with care."}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
            {highlights.map((h, idx) => (
              <div key={idx} className="flex items-center space-x-1">
                {h.icon}
                <span className="text-[10px] text-[#4A4A4A] font-medium">{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Price + Cart/Edit */}
        <div className="flex justify-between items-center pt-2 border-t border-amber-900/5">
          {/* Price */}
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base sm:text-lg font-bold text-[#1C2E1A]">₹{discountedPrice}</span>
            {hasDiscount && (
              <span className="text-xs line-through text-neutral-400">₹{product.price}</span>
            )}
          </div>

          {/* Circular Button */}
          {authUser?.role === "admin" ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/account/admin/products/${product._id}/edit`);
              }}
              className="bg-[#153A1D] hover:bg-[#1e4e28] text-white p-2 rounded-full shadow-sm hover:shadow transition-colors flex items-center justify-center relative z-20"
              aria-label="Edit product"
            >
              <IconEdit className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(e);
              }}
              className="bg-[#153A1D] hover:bg-[#1e4e28] text-white p-2 rounded-full shadow-sm hover:shadow transition-colors flex items-center justify-center relative z-20"
              aria-label="Add to cart"
            >
              {added ? <IconCheck className="w-4 h-4" /> : <IconBag className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

    </Link>
  );
};
