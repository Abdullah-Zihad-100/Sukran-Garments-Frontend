import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-md w-full text-center">
        {/* Big gradient 404 */}
        <h1 className="text-8xl sm:text-9xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="mt-4 text-xl sm:text-2xl font-bold text-gray-800">
          পেজটি খুঁজে পাওয়া যায়নি
        </h2>
        <p className="mt-2 text-gray-500 text-sm sm:text-base">
          দুঃখিত, আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরিয়ে ফেলা হয়েছে অথবা এই
          লিংকটি সঠিক নয়।
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm"
          >
            ← পূর্বের পেজে যান
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 active:opacity-80 transition-opacity shadow"
          >
            হোমপেজে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
