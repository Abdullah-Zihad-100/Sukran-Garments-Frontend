import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Truck, RotateCcw, Shield, ChevronRight, Sparkles } from "lucide-react";

const categories = [
  { name: "শাড়ি", emoji: "🥻", desc: "বেনারসি, জামদানি ও আরো অনেক" },
  { name: "জামা", emoji: "👗", desc: "কুর্তি, টপস ও ক্যাজুয়াল" },
  { name: "থ্রি-পিস", emoji: "👘", desc: "কটন, জর্জেট ও সিল্ক" },
  { name: "সালোয়ার কামিজ", emoji: "🪡", desc: "এমব্রয়ডারি ও প্রিন্টেড" },
];

const features = [
  {
    icon: <Truck size={28} className="text-pink-500" />,
    bg: "bg-pink-50",
    title: "দ্রুত ডেলিভারি",
    sub: "ঢাকায় ২-৩ দিন, বাইরে ৩-৫ দিন",
  },
  {
    icon: <Shield size={28} className="text-purple-500" />,
    bg: "bg-purple-50",
    title: "ক্যাশ অন ডেলিভারি",
    sub: "পণ্য পেয়ে টাকা দিন",
  },
  {
    icon: <RotateCcw size={28} className="text-blue-500" />,
    bg: "bg-blue-50",
    title: "সহজ রিটার্ন",
    sub: "৩ দিনের মধ্যে সম্পূর্ণ রিটার্ন",
  },
];

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden h-56 bg-gray-100">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
            👗
          </div>
        )}
        {product.isNewStock && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
            নতুন
          </span>
        )}
        {product.discountPrice && (
          <div className="absolute top-3 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
            -{Math.round((1 - product.discountPrice / product.price) * 100)}%
            ছাড়
          </div>
        )}
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

export default function Home() {
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products?isNewStock=true`)
      .then((res) => setNewProducts(res.data.slice(0, 8)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ১. Hero Banner */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-500 rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full opacity-10 translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 py-24 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-pink-300 border border-white/10">
            <Sparkles size={14} />
            নতুন কালেকশন এসেছে
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            আপনার স্বপ্নের
            <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              পোশাক খুঁজুন
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl">
            সুক্রান গার্মেন্টসে আছে শাড়ি, জামা, থ্রি-পিস ও সালোয়ার কামিজের
            বিশাল সংগ্রহ — সাশ্রয়ী মূল্যে।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              to="/products"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-pink-500/30 hover:scale-105"
            >
              এখনই কিনুন
            </Link>
            <Link
              to="/about"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-200 border border-white/20"
            >
              আমাদের সম্পর্কে
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-6 pt-6 border-t border-white/10">
            {[
              { value: "১০০০+", label: "সন্তুষ্ট গ্রাহক" },
              { value: "৫০০+", label: "পণ্য সংগ্রহ" },
              { value: "৯৯%", label: "সন্তুষ্টির হার" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-pink-400">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ২. ক্যাটাগরি সেকশন */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            আমাদের বিভাগ
          </h2>
          <p className="text-gray-500">আপনার পছন্দের ক্যাটাগরি বেছে নিন</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-center hover:-translate-y-1"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {cat.emoji}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-400">{cat.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-pink-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                দেখুন <ChevronRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ৩. নতুন পণ্য */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                নতুন স্টক
              </h2>
              <p className="text-gray-500">সর্বশেষ আসা পণ্যগুলো দেখুন</p>
            </div>
            <Link
              to="/products?isNewStock=true"
              className="hidden md:flex items-center gap-1 text-pink-500 hover:text-pink-600 font-medium text-sm transition"
            >
              সব দেখুন <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-72 animate-pulse"
                />
              ))}
            </div>
          ) : newProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {newProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-10">
              এখনো কোনো নতুন পণ্য নেই
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-pink-500 font-medium"
            >
              সব দেখুন <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ৪. কেন আমাদের বেছে নিন */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            কেন আমাদের বেছে নিন?
          </h2>
          <p className="text-gray-500">
            আমাদের সেবা যা আপনাকে আলাদা অভিজ্ঞতা দেবে
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-center group hover:-translate-y-1"
            >
              <div
                className={`w-16 h-16 ${f.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm">{f.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ৫. CTA Section */}
      <section className="mx-4 md:mx-auto max-w-6xl mb-16">
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-white rounded-full opacity-5 translate-x-1/2 translate-y-1/2" />
          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">
              আজই শপিং শুরু করুন
            </h2>
            <p className="text-pink-100 mb-8 max-w-md mx-auto">
              আমাদের সংগ্রহ থেকে আপনার পছন্দের পোশাক বেছে নিন — ক্যাশ অন
              ডেলিভারিতে।
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-pink-500 font-bold px-10 py-4 rounded-full hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              সব পণ্য দেখুন
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
