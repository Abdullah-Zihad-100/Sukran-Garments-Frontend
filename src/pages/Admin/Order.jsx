import { useEffect, useState } from "react";
import axios from "axios";
import { useAdmin } from "../../context/AdminContext";
import toast from "react-hot-toast";

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels = {
  pending: "অপেক্ষমান",
  confirmed: "নিশ্চিত",
  shipped: "পাঠানো হয়েছে",
  delivered: "ডেলিভারি হয়েছে",
  cancelled: "বাতিল",
};

const ORDERS_PER_PAGE = 15;

export default function Orders() {
  const { token } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // filter পরিবর্তন হলে page 1-এ ফিরিয়ে আনো
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("স্ট্যাটাস আপডেট হয়েছে ✅");
      fetchOrders();
    } catch {
      toast.error("আপডেট হয়নি");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত এই অর্ডারটি ডিলিট করতে চান?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("অর্ডার ডিলিট হয়েছে ✅");
      fetchOrders();
    } catch {
      toast.error("ডিলিট হয়নি");
    }
  };


  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const totalPages = Math.ceil(filtered.length / ORDERS_PER_PAGE) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          অর্ডার লিস্ট
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          মোট {orders.length}টি অর্ডার
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === "all" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100"}`}
        >
          সব ({orders.length})
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          >
            {statusLabels[s]} ({orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-12 text-gray-400 text-sm">
          কোনো অর্ডার নেই
        </div>
      ) : (
        <>
          {/* Mobile card view - only visible below md breakpoint */}
          <div className="flex flex-col gap-3 md:hidden">
            {paginated.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-gray-400 text-xs">{order.phone}</p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-1 rounded-lg text-xs font-medium ${statusColors[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>

                <p className="text-gray-400 text-xs">{order.address}</p>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 font-medium">
                      {order.productName}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {order.selectedColor} · {order.selectedSize}
                    </p>
                  </div>
                  <p className="font-bold text-pink-500">৳{order.totalPrice}</p>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <p className="text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                  </p>
                </div>

                {/* Status update - full width, easy to tap */}
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {statusLabels[s]}
                    </option>
                  ))}
                </select>

                {/* Delete button - full width, clearly separated */}
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="w-full text-sm font-medium px-3 py-2.5 rounded-xl text-red-600 bg-red-50 active:bg-red-100 transition-colors"
                >
                  🗑️ অর্ডার ডিলিট করুন
                </button>
              </div>
            ))}
          </div>
          {/* Desktop table view - hidden below md breakpoint, unchanged */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      গ্রাহক
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      পণ্য
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      রং / সাইজ
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      মোট
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      স্ট্যাটাস
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      তারিখ
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      আপডেট
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      ডিলিট
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">
                          {order.customerName}
                        </p>
                        <p className="text-gray-400 text-xs">{order.phone}</p>
                        <p className="text-gray-400 text-xs">{order.address}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 font-medium">
                          {order.productName}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-600">{order.selectedColor}</p>
                        <p className="text-gray-400 text-xs">
                          {order.selectedSize}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-pink-500">
                          ৳{order.totalPrice}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-1 py-1 rounded-lg text-xs ${statusColors[order.status]}`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {statusLabels[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="text-xs px-3 py-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          ডিলিট
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                {(currentPage - 1) * ORDERS_PER_PAGE + 1}–
                {Math.min(currentPage * ORDERS_PER_PAGE, filtered.length)} এর
                মধ্যে {filtered.length}টি দেখানো হচ্ছে
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  পূর্বে
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        page === currentPage
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  পরে
                </button>
              </div>
            </div>
          </div>

          {/* Mobile pagination - shown separately below cards */}
          <div className="md:hidden flex flex-col items-center gap-2">
            <p className="text-xs text-gray-400">
              {(currentPage - 1) * ORDERS_PER_PAGE + 1}–
              {Math.min(currentPage * ORDERS_PER_PAGE, filtered.length)} এর
              মধ্যে {filtered.length}টি দেখানো হচ্ছে
            </p>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                পূর্বে
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      page === currentPage
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow"
                        : "text-gray-600 bg-white hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                পরে
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
