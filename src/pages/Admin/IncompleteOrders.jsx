import { useEffect, useState } from "react";
import axios from "axios";
import { useAdmin } from "../../context/AdminContext";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react"; // ডিলিট আইকনের জন্য

const statuses = ["Pending", "Ordered"];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Ordered: "bg-green-100 text-green-700",
};

const statusLabels = {
  Pending: "অসম্পূর্ণ (পেন্ডিং)",
  Ordered: "অর্ডার করা হয়েছে",
};

const LEADS_PER_PAGE = 15;

export default function IncompleteOrders() {
  const { token } = useAdmin();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // সব লিড সার্ভার থেকে নিয়ে আসার ফাংশন
  const fetchLeads = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/incomplete-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLeads(res.data))
      .catch(() => toast.error("অসম্পূর্ণ অর্ডার লোড করা যায়নি"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ফিল্টার পরিবর্তন হলে পেজ নাম্বার ১-এ ফিরিয়ে নেওয়া
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // লিড ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "আপনি কি নিশ্চিতভাবে এই অসম্পূর্ণ অর্ডারটি ডিলিট করতে চান?",
      )
    )
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}//incomplete-orders/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("অসম্পূর্ণ অর্ডারটি ডিলিট হয়েছে 🗑️");
      fetchLeads();
    } catch {
      toast.error("ডিলিট করা যায়নি");
    }
  };

  const filtered =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const totalPages = Math.ceil(filtered.length / LEADS_PER_PAGE) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * LEADS_PER_PAGE,
    currentPage * LEADS_PER_PAGE,
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
          অসম্পূর্ণ অর্ডার লিস্ট (Leads)
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          মোট {leads.length}টি অসম্পূর্ণ অর্ডার রয়েছে
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === "all" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100"}`}
        >
          সব ({leads.length})
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          >
            {statusLabels[s]} ({leads.filter((l) => l.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-12 text-gray-400 text-sm">
          কোনো অসম্পূর্ণ অর্ডার নেই
        </div>
      ) : (
        <>
          {/* Mobile Card View (md ব্রেকপয়েন্টের নিচে দেখাবে) */}
          <div className="flex flex-col gap-3 md:hidden">
            {paginated.map((lead) => (
              <div
                key={lead._id}
                className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {lead.customerName}
                    </p>
                    <p className="text-gray-400 text-xs">{lead.phone}</p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-1 rounded-lg text-xs font-medium ${statusColors[lead.status || "Pending"]}`}
                  >
                    {statusLabels[lead.status || "Pending"]}
                  </span>
                </div>

                <p className="text-gray-400 text-xs">
                  {lead.address || "ঠিকানা দেওয়া হয়নি"}
                </p>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 font-medium">
                      {lead.productName || "পণ্য নির্দিষ্ট নয়"}
                    </p>
                    {lead.orderItems && lead.orderItems[0] && (
                      <p className="text-gray-500 text-xs mt-0.5">
                        {lead.orderItems[0].color &&
                          `${lead.orderItems[0].color}`}
                        {lead.orderItems[0].size &&
                          ` · ${lead.orderItems[0].size}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-500">
                      ৳{lead.totalPrice || "0"}
                    </p>
                    <p className="text-gray-400 text-[10px]">
                      পরিমাণ: {lead.quantity || "1"}টি
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between gap-3">
                  <p className="text-gray-400 text-xs shrink-0">
                    {new Date(lead.createdAt).toLocaleDateString("bn-BD", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <button
                    onClick={() => handleDelete(lead._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                  >
                    <Trash2 size={14} /> ডিলিট করুন
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (md ব্রেকপয়েন্টের ওপরে দেখাবে) */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      গ্রাহক
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      পণ্য ও বিবরণ
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      মোট মূল্য
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      স্ট্যাটাস
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      সময় ও তারিখ
                    </th>
                    <th className="text-center px-4 py-3 text-gray-600 font-semibold w-24">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((lead) => (
                    <tr
                      key={lead._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* গ্রাহক তথ্য */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">
                          {lead.customerName}
                        </p>
                        <p className="text-gray-400 text-xs">{lead.phone}</p>
                        <p className="text-gray-400 text-xs max-w-xs truncate">
                          {lead.address || "ঠিকানা দেওয়া হয়নি"}
                        </p>
                      </td>

                      {/* প্রোডাক্ট তথ্য */}
                      <td className="px-4 py-3">
                        <p className="text-gray-700 font-medium">
                          {lead.productName || "পণ্য নির্দিষ্ট নয়"}
                        </p>
                        {lead.orderItems && lead.orderItems[0] && (
                          <p className="text-gray-400 text-xs">
                            রং: {lead.orderItems[0].color || "N/A"} | সাইজ:{" "}
                            {lead.orderItems[0].size || "N/A"}
                          </p>
                        )}
                      </td>

                      {/* মোট হিসাব */}
                      <td className="px-4 py-3">
                        <p className="font-bold text-pink-500">
                          ৳{lead.totalPrice || "0"}
                        </p>
                        <p className="text-gray-400 text-xs">
                          পরিমাণ: {lead.quantity || "1"}টি
                        </p>
                      </td>

                      {/* স্ট্যাটাস */}
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[lead.status || "Pending"]}`}
                        >
                          {statusLabels[lead.status || "Pending"]}
                        </span>
                      </td>

                      {/* সময় ও তারিখ */}
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        <div>
                          {new Date(lead.createdAt).toLocaleDateString("bn-BD")}
                        </div>
                        <div className="text-[10px]">
                          {new Date(lead.createdAt).toLocaleTimeString(
                            "bn-BD",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </td>

                      {/* অ্যাকশন বাটন */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 p-2 rounded-lg transition-colors inline-flex items-center gap-1"
                          title="ডিলিট করুন"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Desktop Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                {(currentPage - 1) * LEADS_PER_PAGE + 1}–
                {Math.min(currentPage * LEADS_PER_PAGE, filtered.length)} এর
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

          {/* Mobile Pagination (আলাদা করে কার্ডের নিচে দেখানোর জন্য) */}
          <div className="md:hidden flex flex-col items-center gap-2">
            <p className="text-xs text-gray-400">
              {(currentPage - 1) * LEADS_PER_PAGE + 1}–
              {Math.min(currentPage * LEADS_PER_PAGE, filtered.length)} এর মধ্যে{" "}
              {filtered.length}টি দেখানো হচ্ছে
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
