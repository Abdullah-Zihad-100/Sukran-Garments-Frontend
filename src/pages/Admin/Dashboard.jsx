import { useEffect, useState } from "react";
import axios from "axios";
import { useAdmin } from "../../tempContext/AdminContext";
import { ShoppingBag, ClipboardList, XCircle, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { token } = useAdmin();
  const [stats, setStats] = useState({ total: 0, orders: 0, cancelled: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get("https://sukran-graments-frontend.onrender.com/api/products", {
        headers,
      }),
      axios.get("https://sukran-graments-frontend.onrender.com/api/orders", {
        headers,
      }),
    ])
      .then(([prodRes, orderRes]) => {
        const products = prodRes.data;
        const orders = orderRes.data;
        const cancelled = orders.filter((o) => o.status === "cancelled").length;

        setStats({
          total: products.length,
          orders: orders.length,
          cancelled,
        });

        // Last 7 days
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const label = `${date.getDate()}/${date.getMonth() + 1}`;
          const count = orders.filter((o) => {
            const d = new Date(o.createdAt);
            return d.toDateString() === date.toDateString();
          }).length;
          days.push({ day: label, count });
        }
        setChartData(days);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const statCards = [
    {
      label: "মোট পণ্য",
      value: stats.total,
      icon: <ShoppingBag size={22} className="text-pink-500" />,
      bg: "bg-pink-50",
      border: "border-pink-200",
    },
    {
      label: "মোট অর্ডার",
      value: stats.orders,
      icon: <ClipboardList size={22} className="text-purple-500" />,
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      label: "বাতিল অর্ডার",
      value: stats.cancelled,
      icon: <XCircle size={22} className="text-red-500" />,
      bg: "bg-red-50",
      border: "border-red-200",
    },
    {
      label: "সফল অর্ডার",
      value: stats.orders - stats.cancelled,
      icon: <TrendingUp size={22} className="text-green-500" />,
      bg: "bg-green-50",
      border: "border-green-200",
    },
  ];

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">ড্যাশবোর্ড</h1>
        <p className="text-gray-500 text-sm mt-1">
          আপনার ব্যবসার সংক্ষিপ্ত তথ্য
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm`}
          >
            <div
              className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}
            >
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart — Custom Bar Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-6">গত ৭ দিনের অর্ডার</h2>
        <div className="flex items-end gap-3 h-48">
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-gray-600">{d.count}</span>
              <div
                className="w-full relative flex items-end"
                style={{ height: "140px" }}
              >
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-pink-500 to-purple-400 transition-all duration-500"
                  style={{
                    height: `${(d.count / maxCount) * 140}px`,
                    minHeight: d.count > 0 ? "8px" : "0",
                  }}
                />
              </div>
              <span className="text-xs text-gray-400">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
