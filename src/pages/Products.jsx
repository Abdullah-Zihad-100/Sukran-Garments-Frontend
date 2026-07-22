import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Heart, Search, SlidersHorizontal, X } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

const categories = ["সব পণ্য", "শাড়ি", "জামা", "থ্রি-পিস", "সালোয়ার কামিজ"];

function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden h-60 bg-gray-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            👗
          </div>
        )}
        {product.isNewStock && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            নতুন
          </span>
        )}
        {product.discountPrice && (
          <span className="absolute top-3 right-14 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            -{Math.round((1 - product.discountPrice / product.price) * 100)}%
          </span>
        )}
        <button
          onClick={() => toggleFavorite(product)}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart
            size={16}
            className={
              isFavorite(product._id)
                ? "fill-pink-500 text-pink-500"
                : "text-gray-400"
            }
          />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-purple-500 font-medium mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          {product.discountPrice ? (
            <>
              <span className="text-pink-500 font-bold">
                ৳{product.discountPrice}
              </span>
              <span className="text-gray-400 text-xs line-through">
                ৳{product.price}
              </span>
            </>
          ) : (
            <span className="text-pink-500 font-bold">৳{product.price}</span>
          )}
        </div>
        <Link
          to={`/products/${product._id}`}
          className="block w-full text-center bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm py-2.5 rounded-xl transition-all duration-200 hover:shadow-md font-medium"
        >
          বিস্তারিত দেখুন
        </Link>
      </div>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const activeCategory = searchParams.get("category") || "সব পণ্য";
  const isNewStock = searchParams.get("isNewStock") === "true";

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory !== "সব পণ্য") params.category = activeCategory;
    if (isNewStock) params.isNewStock = true;

    axios
      .get(`${import.meta.env.VITE_API_URL}/products`, {
        params,
      })
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory, isNewStock]);

  const handleCategory = (cat) => {
    if (cat === "সব পণ্য") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-10 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">আমাদের পণ্য সংগ্রহ</h1>
        <p className="text-pink-100">সেরা মানের পোশাক সাশ্রয়ী মূল্যে</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="md:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:border-pink-300 transition"
          >
            <SlidersHorizontal size={16} />
            ফিল্টার
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter — Desktop */}
          <div className="hidden md:block w-52 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4">ক্যাটাগরি</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeCategory === cat ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm" : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* New Stock Filter */}
              <div className="mt-5 pt-5 border-t border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3">স্টক</h3>
                <button
                  onClick={() =>
                    setSearchParams(isNewStock ? {} : { isNewStock: true })
                  }
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isNewStock ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"}`}
                >
                  ✨ নতুন স্টক
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter */}
          {showFilter && (
            <div
              className="md:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowFilter(false)}
            >
              <div
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-semibold text-gray-800 mb-4">ক্যাটাগরি</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleCategory(cat);
                        setShowFilter(false);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeCategory === cat ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setSearchParams(isNewStock ? {} : { isNewStock: true });
                    setShowFilter(false);
                  }}
                  className={`mt-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isNewStock ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  ✨ নতুন স্টক
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filter Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {activeCategory !== "সব পণ্য" && (
                <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-medium">
                  {activeCategory}
                  <button onClick={() => setSearchParams({})}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {isNewStock && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                  নতুন স্টক
                  <button onClick={() => setSearchParams({})}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {!loading && (
                <span className="text-xs text-gray-400 ml-auto">
                  {filtered.length}টি পণ্য
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-72 animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-500 font-medium">
                  কোনো পণ্য পাওয়া যায়নি
                </p>
                <button
                  onClick={() => {
                    setSearchParams({});
                    setSearch("");
                  }}
                  className="mt-4 text-pink-500 text-sm hover:underline"
                >
                  সব পণ্য দেখুন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
