import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useProductStore } from '../services/useProductStore';
import { Reveal } from '../components/Reveal';
import { IconClose } from '../components/Icons';
import { SkeletonCard } from '../components/PageLoader';

interface ProductsProps {
  category?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Products', path: '/products' },
  { id: 'millets', label: 'Millets', path: '/products/millets' },
  { id: 'nuts', label: 'Nuts', path: '/products/nuts' },
  { id: 'rice', label: 'Rice', path: '/products/rice' },
  { id: 'spices', label: 'Spices', path: '/products/spices' },
  { id: 'pickles', label: 'Pickles', path: '/products/pickles' },
];

export const Products: React.FC<ProductsProps> = ({ category: propCategory }) => {
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const allProducts = useProductStore((state) => state.products);
  const storeLoading = useProductStore((state) => state.loading);

  const { category: paramCategory } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const activeCategory = propCategory || paramCategory || "all";
  const navigate = useNavigate();

  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [localLoading, setLocalLoading] = useState(allProducts.length === 0);

  // Fetch products on mount
  useEffect(() => {
    setLocalLoading(allProducts.length === 0);
    fetchProducts().finally(() => {
      setLocalLoading(false);
    });
  }, [fetchProducts]);

  // Filter products
  useEffect(() => {
    let filtered = [...allProducts];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.productName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    } else if (activeCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    setDisplayProducts(filtered);
  }, [activeCategory, allProducts, searchQuery]);

  const loading = storeLoading || localLoading;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Category Slider */}
        {!searchQuery && (
          <div className="mb-12 overflow-x-auto no-scrollbar py-2">
            <div className="flex space-x-3 min-w-max">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(cat.path)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all ${
                    activeCategory === cat.id
                      ? "bg-[#153A1D] text-white border-[#153A1D]"
                      : "bg-[#FCFBF8] text-neutral-600 border-amber-900/15 hover:border-[#153A1D]/30"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <header className="mb-8 border-b border-amber-900/10 pb-6">
          <h1 className="text-3xl font-display font-extrabold mb-2 text-[#1C2E1A]">
            {searchQuery ? `Search results for "${searchQuery}"` : "Products"}
          </h1>

          <p className="text-[#5A5A5A] font-light">
            {searchQuery
              ? `Found ${displayProducts.length} results`
              : "Browse our organic collection"}
          </p>

          {searchQuery && (
            <button
              onClick={() => navigate("/products")}
              className="mt-3 text-sm flex items-center text-[#153A1D] hover:underline font-medium"
            >
              Clear Search <IconClose className="w-4 h-4 ml-1" />
            </button>
          )}
        </header>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <Reveal key={product._id}>
                  <ProductCard product={product} />
                </Reveal>
              ))
            ) : (
              <div className="col-span-full text-center text-neutral-500 py-20">
                No products found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
