import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

// ফেভারিট পেজের জন্য কাস্টম প্রোডাক্ট কার্ড (যেখানে রিমুভ করার অপশন থাকবে)
function FavoriteProductCard({ product }) {
  const { toggleFavorite } = useFavorites();

  return (
    <>
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

          {/* লিস্ট থেকে মুছে ফেলার বাটন */}
          <button
            onClick={() => toggleFavorite(product)}
            className="absolute top-3 right-3 w-8 h-8 bg-white text-red-500 rounded-full shadow flex items-center justify-center hover:scale-110 hover:bg-red-50 transition-transform"
            title="তালিকা থেকে বাদ দিন"
          >
            <Trash2 size={16} />
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
    </>
  );
}

export default function Favorites() {
  // ধরে নিচ্ছি আপনার FavoritesContext থেকে 'favorites' অ্যারে বা অবজেক্ট পাওয়া যায়
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        {/* হেডার ব্যানার */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-10 px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="fill-white text-white" size={28} />
            <h1 className="text-3xl font-bold">আমার পছন্দের তালিকা</h1>
          </div>
          <p className="text-pink-100">আপনার পছন্দের সব পণ্য একসাথে এখানে</p>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* যদি ফেভারিট লিস্টে প্রোডাক্ট থাকে */}
          {favorites && favorites.length > 0 ? (
            <div>
              <p className="text-sm text-gray-500 mb-6 font-medium">
                মোট {favorites.length}টি পণ্য পছন্দ করা হয়েছে
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {favorites.map((product) => (
                  <FavoriteProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            /* ফেভারিট লিস্ট ফাকা থাকলে এই ভিউ দেখাবে */
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto mt-6">
              <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                আপনার তালিকাটি খালি!
              </h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6 px-4">
                পণ্য দেখার সময় হার্ট (❤️) আইকনে ক্লিক করে আপনার পছন্দের তালিকা
                তৈরি করুন।
              </p>
              <Link
                to="/products"
                className="inline-flex bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                পণ্য দেখতে যান
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
