import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { useProductStore } from '../services/useProductStore';
import { Reveal } from '../components/Reveal';
import { IconClose } from '../components/Icons';

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
  const { products: allProducts } = useProductStore();

  const { category: paramCategory } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const activeCategory = propCategory || paramCategory || "all";
  const navigate = useNavigate();

  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend ONE TIME
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
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
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, allProducts, searchQuery]);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Category Slider */}
        {!searchQuery && (
          <div className="mb-12 overflow-x-auto no-scrollbar py-2">
            <div className="flex space-x-3 min-w-max">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(cat.path)}
                  className={`px-6 py-3 rounded-full text-sm font-medium border transition-all ${
                    activeCategory === cat.id
                      ? "bg-brand-dark text-white border-brand-dark"
                      : "bg-white text-neutral-600 border-neutral-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <header className="mb-8 border-b pb-6">
          <h1 className="text-3xl font-display font-bold mb-2">
            {searchQuery ? `Search results for "${searchQuery}"` : "Products"}
          </h1>

          <p className="text-neutral-500">
            {searchQuery
              ? `Found ${displayProducts.length} results`
              : "Browse our organic collection"}
          </p>

          {searchQuery && (
            <button
              onClick={() => navigate("/products")}
              className="mt-3 text-sm flex items-center text-brand-dark"
            >
              Clear Search <IconClose className="w-4 h-4 ml-1" />
            </button>
          )}
        </header>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 bg-neutral-100 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
