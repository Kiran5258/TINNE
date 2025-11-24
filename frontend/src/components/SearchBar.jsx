import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { debounce } from "../utils/debounce";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);

  const wrapperRef = useRef(null);

  // -----------------------
  // API CALL (debounced)
  // -----------------------
  const fetchSearch = debounce(async (text) => {
    if (!text) {
      setSuggestions([]);
      setProducts([]);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/product/search?query=${text}`);
      const data = await res.json();

      setSuggestions(data.suggestions || []);
      setProducts(data.products || []);
      setOpen(true);
    } catch (err) {
      console.log("Search error:", err);
    }
  }, 400);

  useEffect(() => {
    fetchSearch(query);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Highlight text function
  const highlight = (text) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  return (
    <div className="w-full flex justify-center mt-8 relative" ref={wrapperRef}>
      <div className="w-full max-w-3xl relative">
        {/* Input */}
        <div className="flex items-center border rounded-xl px-4 py-3 shadow-sm">
          <Search className="w-5 h-5 text-gray-500" />

          <input
            type="text"
            placeholder="Search products..."
            className="w-full ml-3 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => setOpen(true)}
          />

          {query && (
            <X
              className="w-5 h-5 cursor-pointer"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setProducts([]);
                setOpen(false);
              }}
            />
          )}
        </div>

        {/* DROPDOWN */}
        {open && (suggestions.length > 0 || products.length > 0) && (
          <div className="absolute mt-2 w-full bg-white shadow-xl rounded-xl border flex p-6 z-50">

            {/* LEFT: Suggestions */}
            <div className="w-1/2 pr-6 border-r">
              <h3 className="font-semibold mb-3">Suggestions</h3>

              <ul className="space-y-2">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="cursor-pointer text-gray-700 hover:text-black"
                    dangerouslySetInnerHTML={{ __html: highlight(s) }}
                  />
                ))}
              </ul>
            </div>

            {/* RIGHT: Products */}
            <div className="w-1/2 pl-6">
              <h3 className="font-semibold mb-3">Products</h3>

              <div className="space-y-4">
                {products.map((p, i) => (
                  <div key={i} className="flex items-center space-x-3 cursor-pointer">
                    <img
                      src={p.image}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-gray-600">{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
