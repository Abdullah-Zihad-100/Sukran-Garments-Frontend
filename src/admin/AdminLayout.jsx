import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import {
  LayoutDashboard,
  ClockAlert,
  ShoppingBag,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const navItems = [
  {
    to: "/admin/dashboard",
    icon: <LayoutDashboard size={18} />,
    label: "ড্যাশবোর্ড",
  },
  { to: "/admin/products", icon: <ShoppingBag size={18} />, label: "পণ্য" },
  { to: "/admin/orders", icon: <ClipboardList size={18} />, label: "অর্ডার" },
  {
    to: "/admin/incomplete-orders",
    icon: <ClockAlert size={18} />,
    label: "অসম্পূর্ণ অর্ডার",
  },
];

export default function AdminLayout() {
  const { logout } = useAdmin();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("লগআউট হয়েছে");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-slate-900 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <Link to="/" className="flex">
          <svg
            width="270"
            height="100"
            viewBox="0 0 680 260"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="petalGrad2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stop-color="#F4C0D1" />
                <stop offset="100%" stop-color="#D4537E" />
              </linearGradient>
            </defs>
            <g transform="translate(120,130)">
              <g transform="rotate(0)">
                <ellipse
                  cx="0"
                  cy="-38"
                  rx="20"
                  ry="38"
                  fill="url(#petalGrad2)"
                />
              </g>
              <g transform="rotate(60)">
                <ellipse
                  cx="0"
                  cy="-38"
                  rx="20"
                  ry="38"
                  fill="url(#petalGrad2)"
                  opacity="0.92"
                />
              </g>
              <g transform="rotate(120)">
                <ellipse
                  cx="0"
                  cy="-38"
                  rx="20"
                  ry="38"
                  fill="url(#petalGrad2)"
                  opacity="0.92"
                />
              </g>
              <g transform="rotate(180)">
                <ellipse
                  cx="0"
                  cy="-38"
                  rx="20"
                  ry="38"
                  fill="url(#petalGrad2)"
                />
              </g>
              <g transform="rotate(240)">
                <ellipse
                  cx="0"
                  cy="-38"
                  rx="20"
                  ry="38"
                  fill="url(#petalGrad2)"
                  opacity="0.92"
                />
              </g>
              <g transform="rotate(300)">
                <ellipse
                  cx="0"
                  cy="-38"
                  rx="20"
                  ry="38"
                  fill="url(#petalGrad2)"
                  opacity="0.92"
                />
              </g>
              <circle cx="0" cy="0" r="16" fill="#72243E" />
              <circle
                cx="0"
                cy="0"
                r="16"
                fill="none"
                stroke="#FBEAF0"
                stroke-width="1.5"
              />
            </g>
            <text
              x="215"
              y="120"
              font-family="Georgia, serif"
              font-size="52"
              font-weight="500"
              fill="#993556"
            >
              Sukran
            </text>
            <text
              x="215"
              y="170"
              font-family="Georgia, serif"
              font-size="52"
              font-weight="500"
              fill="#72243E"
            >
              Garments
            </text>
            <text
              x="217"
              y="200"
              font-family="Arial, sans-serif"
              font-size="16"
              letter-spacing="2"
              fill="#D4537E"
            >
              WOMEN'S FASHION &#183; BANGLADESH
            </text>
          </svg>
        </Link>

        {/* Nav Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={18} />
            লগআউট
          </button>
        </div>
      </aside>

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-60 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-600 hover:text-pink-500 transition"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="md:hidden" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">
              Admin
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
