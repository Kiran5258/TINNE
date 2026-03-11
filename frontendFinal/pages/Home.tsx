import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { Button } from "../components/Button";
import {
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "../components/Icons";
import { ProductCard } from "../components/ProductCard";
import { BlogCard } from "../components/BlogCard";
import { useProductStore } from "../services/useProductStore";
import { useBlogStore } from "../services/useBlogStore";
import { Reveal } from "../components/Reveal";
import { useHeroStore } from "../services/useHeroStore";
import { PromoPopup } from "../components/PromoPopup";

// ------------------------------
// CATEGORY SHORTCUT CARDS
// ------------------------------
const CATEGORIES = [
  {
    id: "millets",
    label: "Millets",
    path: "/products/millets",
    image: "https://th.bing.com/th/id/OIP.SsH7Uy0K8XTvUUXNIwNC7gHaHa?w=181&h=184&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    id: "nuts",
    label: "Nuts",
    path: "/products/nuts",
    image:
      "https://th.bing.com/th/id/OIP.0Eu4Hu_YAsjISkYppBLYlAHaLH?w=129&h=193&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    id: "rice",
    label: "Rice",
    path: "/products/rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "spices",
    label: "Spices",
    path: "/products/spices",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
  },
];

// ------------------------------
// FALLBACK HERO IMAGES
// ------------------------------
const FALLBACK_IMAGES = [
  "https://aistudiocdn.com/d/f3af9610-c020-4357-96a6-f2b74070a248",
  "https://aistudiocdn.com/d/ef70b686-e91b-4f91-817e-7bf33f019054",
  "https://aistudiocdn.com/d/1c062c3e-52f0-4660-848e-6c0b36879e95",
];

export const Home: React.FC = () => {
  // ---------------------------
  // HERO BANNER (BACKEND + FALLBACK)
  // ---------------------------
  const { images, fetchHero } = useHeroStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use backend images if present, otherwise fallback
  const heroImages = useMemo(
    () => (images && images.length > 0 ? images : FALLBACK_IMAGES),
    [images]
  );

  // Load hero images once
  useEffect(() => {
    fetchHero();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (heroImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages]);

  const nextSlide = () => {
    if (heroImages.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    if (heroImages.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  // ---------------------------
  // PRODUCTS & BLOG DATA
  // ---------------------------
  const { products, fetchProducts } = useProductStore();
  const { getFeaturedPosts } = useBlogStore();

  // Load products once (so Home also shows latest products)
  useEffect(() => {
    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);
  const featuredPosts = getFeaturedPosts ? getFeaturedPosts() : [];

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div className="w-full pt-20">
      <PromoPopup />
      {/* =======================================
          HERO BANNER
      ======================================== */}
      <section className="relative h-[calc(100vh-5rem)] min-h-[600px] w-full overflow-hidden bg-neutral-900">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-20">
          <Reveal direction="up" delay={200}>
            <h1 className="font-script text-7xl md:text-9xl text-white mb-6 drop-shadow-lg opacity-95">
              Tinné
            </h1>
          </Reveal>

          <Reveal direction="up" delay={400}>
            <p className="text-xl md:text-3xl text-neutral-100 font-light tracking-[0.2em] uppercase mb-10 drop-shadow-md border-t border-b border-white/30 py-4 px-8 backdrop-blur-sm bg-white/5">
              From Grandma&apos;s Thinnai
            </p>
          </Reveal>

          <Reveal direction="up" delay={600}>
            <div className="flex gap-4">
              <Button
                variant="primary"
                size="lg"
                className="bg-brand-accent text-brand-dark hover:bg-white hover:text-brand-dark border-none min-w-[160px]"
              >
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-brand-dark min-w-[160px]"
              >
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md p-4 rounded-full text-white transition-all z-20 border border-white/20 hidden md:block"
        >
          <IconChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-md p-4 rounded-full text-white transition-all z-20 border border-white/20 hidden md:block"
        >
          <IconChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? "bg-brand-accent w-12" : "bg-white/50 w-3"
                }`}
            />
          ))}
        </div>
      </section>

      {/* =======================================
          PRODUCT SHOWCASE + CATEGORIES
      ======================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex justify-between items-end mb-16">
            <Reveal className="max-w-xl">
              <h2 className="text-4xl font-display font-bold text-neutral-900 mb-3">
                Product Showcases
              </h2>
              <div className="h-1 w-20 bg-brand-accent mb-4" />
              <p className="text-neutral-500 text-lg">
                Curated collections handpicked for exceptional quality, purity,
                and freshness directly from the source.
              </p>
            </Reveal>

            <Link
              to="/products"
              className="hidden md:flex items-center text-brand-dark font-bold hover:text-brand-accent transition-colors border-b-2 border-transparent hover:border-brand-accent pb-1"
            >
              View All Collection <IconArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {/* Featured Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-24">
            {featuredProducts.map((product, idx) => (
              <Reveal key={product._id} delay={idx * 100}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          {/* Category Shortcuts */}
          <div className="mb-8">
            <Reveal className="text-center mb-10">
              <span className="text-brand-accent font-bold tracking-wider uppercase text-sm">
                Discover by Category
              </span>
              <h3 className="text-2xl font-display font-bold text-neutral-900 mt-2">
                Essential Ingredients
              </h3>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {CATEGORIES.map((cat, idx) => (
                <Reveal key={cat.id} delay={idx * 100}>
                  <Link
                    to={cat.path}
                    className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 block"
                  >
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500 group-hover:-translate-y-2">
                      <p className="font-display font-bold text-2xl mb-1">
                        {cat.label}
                      </p>
                      <div className="h-0.5 w-12 bg-brand-accent mb-3 transition-all duration-500 group-hover:w-full" />
                      <span className="text-xs font-medium uppercase tracking-widest flex items-center opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                        Explore <IconArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Mobile "View All" */}
          <div className="mt-12 text-center md:hidden">
            <Link to="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =======================================
          BLOG SECTION
      ======================================== */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <Reveal>
              <h2 className="text-3xl font-display font-bold text-neutral-900">
                From the Journal
              </h2>
              <p className="text-neutral-500 mt-2">
                Stories of heritage, health, and sustainable living.
              </p>
            </Reveal>

            <Link
              to="/blog"
              className="hidden md:inline-flex items-center text-brand-dark font-medium hover:text-brand-accent transition-colors"
            >
              Read All Articles <IconArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post, idx) => (
              <Reveal key={post.id} delay={idx * 150}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
