import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import {
  IconMinus,
  IconPlus,
  IconBag,
  IconTrash,
  IconCornerDownRight,
} from "../components/Icons";

import { useCartStore } from "../services/useCartStore";
import { useProductStore } from "../services/useProductStore";
import { useAuthStore } from "../services/useAuthStore";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { Button } from "@/components/Button";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  // ⭐ Review State
  const [rating, setRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");

  const user = useAuthStore((s) => s.authUser);
  const { addItem } = useCartStore();
  const { getProduct } = useProductStore();

  // ================================
  // FETCH PRODUCT + REVIEWS
  // ================================
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const p = await getProduct(id!);
      setProduct(p);
      if (p?.images?.length) setMainImage(p.images[0]);
      if (p?.sizes?.length) setSelectedSize(p.sizes[0]);

      const res = await axiosInstance.get(`/review/${id}`);
      setReviews(res.data);

      setLoading(false);
    };
    load();
  }, [id]);

  // ================================
  // PRICING
  // ================================
  const discount = product?.offerPrice || 0;

  // Base price from selected size OR default product price
  const basePrice = selectedSize?.price ? selectedSize.price : product?.price;

  const discountedPrice =
    discount > 0
      ? basePrice - (basePrice * discount) / 100
      : basePrice;

  const stockAvailable = selectedSize?.stock > 0;

  // ================================
  // ADD TO CART
  // ================================
  const handleAddToCart = () => {
    if (!selectedSize) return toast.error("Select a size!");

    addItem({
      ...product,
      selectedSize,
      quantity,
      subtotal: discountedPrice * quantity,
    });

    toast.success("Added to cart!");
  };

  // ================================
  // REVIEW SUBMIT
  // ================================
  const handleSubmitReview = async (e: any) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    try {
      const res = await axiosInstance.post("/review/add", {
        productId: id,
        rating,
        text: newReviewText,
      });

      setReviews([res.data.review, ...reviews]);
      setNewReviewText("");
      toast.success("Review added!");
    } catch {
      toast.error("Login required");
    }
  };

  // ================================
  // DELETE REVIEW
  // ================================
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await axiosInstance.delete(`/review/${reviewId}`);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      toast.success("Review deleted");
    } catch {
      toast.error("Not allowed");
    }
  };

  // ================================
  // LOADING / NOT FOUND
  // ================================
  if (loading) return <div className="text-center pt-44">Loading...</div>;
  if (!product)
    return (
      <div className="pt-44 text-center">
        Product Not Found • <Link to="/products">Go Back</Link>
      </div>
    );

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">

      {/* Breadcrumb */}
      <div className="text-sm mb-8">
        <Link to="/">Home</Link> /
        <Link to="/products"> Products </Link> /
        <span>{product.productName}</span>
      </div>

      {/* PRODUCT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">

        {/* LEFT SIDE — PREMIUM GALLERY */}
        <div className="flex gap-6">

          {/* Thumbnails */}
          <div className="flex flex-col gap-4 w-24">
            {product.images?.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded-xl border cursor-pointer transition-all 
                ${mainImage === img ? "border-black scale-110" : "border-transparent"}`}
              />
            ))}
          </div>

          {/* MAIN IMAGE */}
          <div className="bg-neutral-50 rounded-3xl p-8 flex-1 cursor-zoom-in">
            <Zoom>
              <img src={mainImage} className="w-full rounded-2xl" />
            </Zoom>
          </div>
        </div>

        {/* RIGHT SIDE — DETAILS */}
        <div>
          <h1 className="text-4xl font-bold mb-3">{product.productName}</h1>

          {/* PRICE */}
          <div className="flex items-center gap-3 mb-4">
            {discount > 0 ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  ₹{discountedPrice}
                </span>
                <span className="line-through text-neutral-500">
                  ₹{basePrice}
                </span>
                <span className="text-green-600 font-semibold text-sm">
                  {product.offerPrice}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">₹{basePrice}</span>
            )}

            <span
              className={`${stockAvailable ? "text-green-600" : "text-red-600"} font-bold`}
            >
              {stockAvailable ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* DESCRIPTION */}
          <div
            className="prose prose-neutral max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {/* SIZE SELECTOR */}
          <div className="mb-6">
            <p className="font-bold mb-2">Choose Size</p>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map((s: any) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedSize(s)}
                  className={`px-6 py-3 border rounded-xl transition 
                  ${selectedSize?.label === s.label
                      ? "bg-black text-white"
                      : "bg-white"
                    }`}
                >
                  {s.label} ({s.stock})
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY + ADD TO CART */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border px-4 py-3 rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <IconMinus />
              </button>
              <span className="px-4">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <IconPlus />
              </button>
            </div>

            <Button onClick={handleAddToCart} disabled={!stockAvailable}>
              <IconBag /> Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* ⭐ REVIEWS SECTION */}
      <div>
        <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

        {/* ADD REVIEW */}
        <div className="bg-neutral-50 p-6 rounded-2xl mb-10">
          <form onSubmit={handleSubmitReview}>
            <p className="font-bold mb-2">Write a Review</p>

            {/* STAR RATING */}
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`text-2xl cursor-pointer ${i <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  onClick={() => setRating(i)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              className="w-full border p-3 rounded-xl mb-3"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
            />

            <Button type="submit">Submit Review</Button>
          </form>
        </div>

        {/* REVIEW LIST */}
        {reviews.map((r) => (
          <div key={r._id} className="border-b pb-6 mb-6">
            <div className="flex justify-between">
              <div>
                <h4 className="font-bold">{r.userName}</h4>
                <p className="text-sm">{r.date}</p>

                {/* Display stars */}
                <div className="text-yellow-500">
                  {"★".repeat(r.rating)}{" "}
                  <span className="text-gray-300">
                    {"★".repeat(5 - r.rating)}
                  </span>
                </div>
              </div>

              {(user && (user._id === r.user || user.role === "admin")) && (
                <button onClick={() => handleDeleteReview(r._id)}>
                  <IconTrash className="text-red-500" />
                </button>
              )}
            </div>

            <p className="mt-3">{r.text}</p>

            {/* Replies */}
            <div className="ml-6 mt-4">
              {r.replies?.map((rep: any, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-3 bg-neutral-100 p-3 rounded-xl mb-2"
                >
                  <IconCornerDownRight />
                  <div>
                    <p className="text-sm">{rep.text}</p>
                    <span className="text-xs text-neutral-400">
                      {rep.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
