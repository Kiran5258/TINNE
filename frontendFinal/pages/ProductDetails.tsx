import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import {
  IconMinus,
  IconPlus,
  IconBag,
  IconTrash,
} from "../components/Icons";

import { useCartStore } from "../services/useCartStore";
import { useProductStore } from "../services/useProductStore";
import { PageLoader } from "../components/PageLoader";
import { useAuthStore } from "../services/useAuthStore";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

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
  if (loading) return <PageLoader message="Fetching product" />;
  if (!product)
    return (
      <div className="pt-44 text-center">
        Product Not Found • <Link to="/products">Go Back</Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FEFCE8] text-[#1C2E1A] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-10 font-sans">
          <Link to="/" className="hover:text-neutral-700 transition-colors">Home</Link>
          <span className="text-neutral-200">/</span>
          <Link to="/products" className="hover:text-neutral-700 transition-colors">Products</Link>
          <span className="text-neutral-200">/</span>
          <span className="text-neutral-700 font-semibold truncate max-w-[200px]">{product.productName}</span>
        </nav>

        {/* PRODUCT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-start">

          {/* LEFT — GALLERY */}
          <div className="flex gap-4 lg:sticky lg:top-28">

            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {product.images?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0
                    ${mainImage === img
                      ? 'border-neutral-900 shadow-md scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-neutral-200'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative group">
              <div className="bg-transparent overflow-hidden cursor-zoom-in aspect-square flex items-center justify-center rounded-3xl">
                <Zoom>
                  <img src={mainImage} className="w-full h-full object-cover scale-[1.35] transition-transform duration-500 group-hover:scale-[1.4]" alt={product.productName} />
                </Zoom>
              </div>
              {/* Offer badge on image */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {product.offerPrice}% OFF
                </div>
              )}
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Click to zoom
              </div>
            </div>
          </div>

          {/* RIGHT — PRODUCT INFO */}
          <div className="flex flex-col gap-6">

            {/* Stock badge + category */}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full
                ${stockAvailable
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-600 border border-red-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stockAvailable ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                {stockAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.category && (
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {product.category}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-neutral-900 leading-tight capitalize">
              {product.productName}
            </h1>

            {/* Price Block — column layout, no dark bg */}
            <div className="flex flex-col gap-1.5">
              {/* Current (discounted) price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-neutral-900">
                  ₹{discountedPrice}
                </span>
                {discount > 0 && (
                  <span className="text-xs font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                    {product.offerPrice}% OFF
                  </span>
                )}
              </div>

              {/* Original price + savings — only when offer exists */}
              {discount > 0 && (
                <div className="flex items-center gap-4 pl-1">
                  <span className="text-sm text-neutral-400 line-through">MRP ₹{basePrice}</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    You save ₹{basePrice - discountedPrice}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div
              className="text-neutral-600 text-sm leading-relaxed border-l-4 border-amber-400 pl-4 prose prose-sm prose-neutral max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Divider */}
            <div className="h-px bg-neutral-100" />

            {/* SIZE SELECTOR */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Choose Size</p>
                {selectedSize && (
                  <span className="text-xs text-neutral-400">
                    {selectedSize.stock} units available
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s: any) => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedSize(s)}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200
                      ${selectedSize?.label === s.label
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-lg shadow-neutral-200'
                        : s.stock === 0
                          ? 'border-neutral-100 bg-neutral-50 text-neutral-300 cursor-not-allowed line-through'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:shadow-sm'}`}
                    disabled={s.stock === 0}
                  >
                    {s.label}
                    {selectedSize?.label === s.label && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY + ADD TO CART */}
            <div className="flex items-center gap-4 pt-2">

              {/* Quantity Stepper */}
              <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-12 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                  <IconMinus />
                </button>
                <span className="w-12 text-center text-base font-bold text-neutral-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-12 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                  <IconPlus />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!stockAvailable}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-neutral-900 to-neutral-800
                  text-white font-bold py-3.5 rounded-xl transition-all duration-200
                  hover:from-neutral-800 hover:to-neutral-700 hover:shadow-xl hover:shadow-neutral-200 hover:-translate-y-0.5
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none text-sm"
              >
                <IconBag className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            {/* Total Price Preview */}
            {quantity > 1 && (
              <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl px-5 py-3">
                <span className="text-sm text-neutral-600 font-medium">Total for {quantity} items</span>
                <span className="text-lg font-bold text-neutral-900">₹{(discountedPrice * quantity).toFixed(0)}</span>
              </div>
            )}


          </div>
        </div>

      {/* REVIEWS SECTION */}
      <div className="mt-4">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-neutral-900">Customer Reviews</h2>
            <p className="text-neutral-400 text-sm mt-1">
              {reviews.length > 0
                ? `${reviews.length} review${reviews.length > 1 ? 's' : ''}`
                : 'Be the first to leave a review'}
            </p>
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => {
                  const avg = reviews.reduce((a: number, r: any) => a + r.rating, 0) / reviews.length;
                  return (
                    <svg key={i} className={`w-5 h-5 ${i <= Math.round(avg) ? 'text-amber-400' : 'text-neutral-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  );
                })}
              </div>
              <span className="text-sm font-semibold text-neutral-600">
                {(reviews.reduce((a: number, r: any) => a + r.rating, 0) / reviews.length).toFixed(1)} / 5
              </span>
            </div>
          )}
        </div>

        {/* WRITE A REVIEW FORM */}
        <div className="bg-gradient-to-br from-neutral-50 to-amber-50/30 border border-neutral-100 rounded-3xl p-8 mb-12 shadow-sm">
          <h3 className="text-lg font-display font-bold text-neutral-900 mb-1">Write a Review</h3>
          <p className="text-sm text-neutral-400 mb-6">Share your experience with this product</p>

          <form onSubmit={handleSubmitReview} className="space-y-5">

            {/* Star Rating Selector */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Your Rating</p>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <button key={i} type="button" onClick={() => setRating(i)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none">
                    <svg className={`w-8 h-8 transition-colors duration-150 ${i <= rating ? 'text-amber-400' : 'text-neutral-200 hover:text-amber-200'}`}
                      fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </button>
                ))}
                <span className="ml-2 text-sm font-semibold text-amber-600">
                  {['','Poor','Fair','Good','Very Good','Excellent'][rating]}
                </span>
              </div>
            </div>

            {/* Text Area */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Your Review</p>
              <textarea
                rows={4}
                placeholder="What did you think of this product? Be specific — others will find it helpful."
                className="w-full border border-neutral-200 bg-white rounded-2xl px-5 py-4 text-sm text-neutral-800
                  placeholder-neutral-300 resize-none outline-none transition-all duration-200
                  focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 hover:border-neutral-300"
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
              />
            </div>

            {/* Submit Row */}
            <div className="flex items-center justify-between">
              {!user && (
                <p className="text-xs text-neutral-400">You must be logged in to post a review.</p>
              )}
              <button
                type="submit"
                disabled={!newReviewText.trim()}
                className="ml-auto px-8 py-3 bg-neutral-900 text-white text-sm font-bold rounded-full
                  hover:bg-neutral-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                  shadow-sm hover:shadow-md"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>

        {/* REVIEW LIST */}
        {reviews.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-neutral-100 rounded-3xl">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
              </svg>
            </div>
            <p className="text-neutral-500 font-medium">No reviews yet</p>
            <p className="text-neutral-400 text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r._id}
                className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">

                {/* Review Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">

                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500
                      flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm">
                      {r.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{r.userName}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {r.date ? new Date(r.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : ''}
                      </p>
                      {/* Stars */}
                      <div className="flex gap-0.5 mt-2">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className={`w-4 h-4 ${i <= r.rating ? 'text-amber-400' : 'text-neutral-200'}`}
                            fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                        <span className="ml-1 text-xs text-neutral-400 font-medium">{r.rating}.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete */}
                  {(user && (user._id === r.user || user.role === 'admin')) && (
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center
                        hover:bg-red-100 hover:text-red-600 transition-all duration-200 flex-shrink-0"
                      title="Delete review"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Review Text */}
                <p className="mt-4 text-sm text-neutral-700 leading-relaxed pl-15">{r.text}</p>

                {/* Replies */}
                {r.replies?.length > 0 && (
                  <div className="mt-5 space-y-3 pl-4 border-l-2 border-amber-100 ml-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      {r.replies.length} {r.replies.length === 1 ? 'Reply' : 'Replies'}
                    </p>
                    {r.replies.map((rep: any, idx: number) => (
                      <div key={idx} className="bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-4 flex gap-3">
                        {/* Reply avatar */}
                        <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-neutral-800">{rep.userName || 'Tinné Team'}</span>
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                              Response
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 leading-relaxed">{rep.text}</p>
                          {rep.date && (
                            <span className="text-xs text-neutral-400 mt-1 block">
                              {new Date(rep.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>{/* /max-w-7xl */}
    </div>
  );
};
