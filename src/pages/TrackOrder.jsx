import { useState } from "react";
import axios from "axios";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Seo from "../components/Seo";

const statusInfo = {
  pending: {
    label: "অপেক্ষমান",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
    icon: <Clock size={20} className="text-yellow-600" />,
  },
  confirmed: {
    label: "নিশ্চিত",
    color: "text-blue-600",
    bg: "bg-blue-100",
    icon: <CheckCircle size={20} className="text-blue-600" />,
  },
  shipped: {
    label: "পাঠানো হয়েছে",
    color: "text-purple-600",
    bg: "bg-purple-100",
    icon: <Truck size={20} className="text-purple-600" />,
  },
  delivered: {
    label: "ডেলিভারি হয়েছে",
    color: "text-green-600",
    bg: "bg-green-100",
    icon: <CheckCircle size={20} className="text-green-600" />,
  },
  cancelled: {
    label: "বাতিল",
    color: "text-red-600",
    bg: "bg-red-100",
    icon: <XCircle size={20} className="text-red-600" />,
  },
};

const steps = ["pending", "confirmed", "shipped", "delivered"];

export default function TrackOrder() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(
        "https://sukran-graments-frontend.onrender.com/api/orders/track",
        {
          params: { phone: phone.trim() },
        },
      );
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <Seo
        title="অর্ডার ট্র্যাক করুন"
        description="আপনার ফোন নাম্বার দিয়ে সহজেই অর্ডার স্ট্যাটাস চেক করুন।"
        url="/track-order"
      />
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12 px-4 text-center">
        <Package size={40} className="mx-auto mb-3 opacity-80" />
        <h1 className="text-3xl font-bold mb-2">অর্ডার ট্র্যাক করুন</h1>
        <p className="text-pink-100">
          আপনার ফোন নম্বর দিয়ে অর্ডারের অবস্থা জানুন
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            ফোন নম্বর দিন
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="01XXXXXXXXX"
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-md transition-all duration-200 disabled:opacity-70 text-sm"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
              ) : (
                "খুঁজুন"
              )}
            </button>
          </div>
        </div>

        {/* No Results */}
        {searched && !loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 font-medium">
              কোনো অর্ডার পাওয়া যায়নি
            </p>
            <p className="text-gray-400 text-sm mt-1">সঠিক ফোন নম্বর দিন</p>
          </div>
        )}

        {/* Order Cards */}
        {orders.map((order) => {
          const status = statusInfo[order.status] || statusInfo.pending;
          const currentStep = steps.indexOf(order.status);

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">অর্ডারের তারিখ</p>
                    <p className="font-medium text-gray-800 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${status.bg}`}
                  >
                    {status.icon}
                    <span className={`text-sm font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-5">
                {/* Progress */}
                {order.status !== "cancelled" && (
                  <div>
                    <div className="flex justify-between mb-3">
                      {steps.map((step, i) => (
                        <div
                          key={step}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i <= currentStep ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : "bg-gray-100 text-gray-400"}`}
                          >
                            {i < currentStep ? "✓" : i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="relative h-1.5 bg-gray-100 rounded-full">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${currentStep <= 0 ? 0 : (currentStep / (steps.length - 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      {["অপেক্ষমান", "নিশ্চিত", "পাঠানো", "ডেলিভারি"].map(
                        (label, i) => (
                          <span
                            key={i}
                            className={`text-xs ${i <= currentStep ? "text-pink-500 font-medium" : "text-gray-400"}`}
                          >
                            {label}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Product */}
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    👗
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {order.productName}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {order.selectedColor}
                    </p>
                    <p className="text-pink-500 font-bold mt-1">
                      ৳{order.totalPrice}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">গ্রাহক</span>
                    <span className="font-medium text-gray-800">
                      {order.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">পরিমাণ</span>
                    <span className="font-medium text-gray-800">
                      {order.quantity}টি
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-500">ঠিকানা</span>
                    <span className="font-medium text-gray-800 text-right max-w-48">
                      {order.address}
                    </span>
                  </div>
                </div>

                {/* Help */}
                <div className="text-center">
                  <p className="text-gray-400 text-xs mb-1">
                    সমস্যা হলে কল করুন
                  </p>
                  <a
                    href="tel:+8801405925125"
                    className="text-pink-500 font-bold hover:text-pink-600 transition"
                  >
                    📞 01405925125
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
