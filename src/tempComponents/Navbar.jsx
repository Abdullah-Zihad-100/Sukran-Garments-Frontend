import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, ChevronDown, Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

const categories = ["শাড়ি", "জামা", "থ্রি-পিস", "সালোয়ার কামিজ"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites } = useFavorites();
  console.log(favorites);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close sidebar on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  const handleCategory = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat)}`);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : "shadow-md"}`}
      >
        <div className="max-w-6xl mx-auto px-4  flex items-center justify-between ">
          {/* Logo */}
          <Link to="/" className="flex">
            <svg
              className="mt-6"
              viewBox="0 0 400 130"
              width="180"
              height="60"
              role="img"
            >
              <defs>
                <linearGradient
                  id="pinkGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" style={{ stopColor: "#ec4899" }} />
                  <stop offset="100%" style={{ stopColor: "#a855f7" }} />
                </linearGradient>
                <linearGradient
                  id="pinkGrad2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" style={{ stopColor: "#ec4899" }} />
                  <stop offset="100%" style={{ stopColor: "#a855f7" }} />
                </linearGradient>
              </defs>
              <rect
                x="0"
                y="5"
                width="64"
                height="64"
                rx="16"
                fill="url(#pinkGrad)"
              />
              <path
                d="M32 19 C32 19 32 15 37 15 C42 15 42 19 42 19 L32 19Z"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M37 19 L37 28"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M15 53 Q37 35 59 53"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="15"
                y1="53"
                x2="15"
                y2="58"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="59"
                y1="53"
                x2="59"
                y2="58"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <text
                x="80"
                y="38"
                fontFamily="Georgia, serif"
                fontSize="30"
                fontWeight="700"
                fill="#1e293b"
                letterSpacing="3"
              >
                SUKRAN
              </text>
              <text
                x="82"
                y="56"
                fontFamily="Arial, sans-serif"
                fontSize="12"
                fill="#a855f7"
                letterSpacing="6"
              >
                GARMENTS
              </text>
              <rect
                x="82"
                y="62"
                width="200"
                height="2.5"
                rx="1.5"
                fill="url(#pinkGrad2)"
              />
            </svg>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <li>
              <Link
                to="/"
                className={`relative pb-1 transition-colors duration-200 hover:text-pink-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-pink-600 after:transition-all after:duration-300 ${isActive("/") ? "text-pink-600 after:w-full" : "after:w-0 hover:after:w-full"}`}
              >
                হোম
              </Link>
            </li>

            {/* Dropdown */}
            <li
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 transition-colors duration-200 hover:text-pink-600 ${location.pathname === "/products" ? "text-pink-600" : ""}`}
              >
                পণ্যসমূহ
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-10 left-0 bg-white shadow-xl rounded-xl w-48 py-2 z-50 transition-all duration-200 origin-top ${dropdownOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"}`}
              >
                <button
                  onClick={() => {
                    navigate("/products");
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-150"
                >
                  সব পণ্য
                </button>
                {categories.map((cat, i) => (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    style={{ transitionDelay: `${i * 30}ms` }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-150"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </li>

            <li>
              <Link
                to="/about"
                className={`relative pb-1 transition-colors duration-200 hover:text-pink-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-pink-600 after:transition-all after:duration-300 ${isActive("/about") ? "text-pink-600 after:w-full" : "after:w-0 hover:after:w-full"}`}
              >
                আমাদের সম্পর্কে
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className={`relative pb-1 transition-colors duration-200 hover:text-pink-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-pink-600 after:transition-all after:duration-300 ${isActive("/contact") ? "text-pink-600 after:w-full" : "after:w-0 hover:after:w-full"}`}
              >
                যোগাযোগ
              </Link>
            </li>
            <li>
              <Link
                to="/track-order"
                className={`relative pb-1 transition-colors duration-200 hover:text-pink-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-pink-600 after:transition-all after:duration-300 ${isActive("/track-order") ? "text-pink-600 after:w-full" : "after:w-0 hover:after:w-full"}`}
              >
                অর্ডার ট্র্যাক করুন
              </Link>
            </li>
            <li>
              <a
                href="https://wa.me/8801733633684"
                target="_blank"
                rel="noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition-all duration-200 hover:shadow-md hover:scale-105"
              >
                WhatsApp ট্র্যাক
              </a>
            </li>
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 hover:text-pink-600 transition-colors duration-200 group"
            >
              <Heart
                size={22}
                className={`transition-transform duration-200 group-hover:scale-110 ${isActive("/favorites") ? "fill-pink-500 text-pink-500" : "text-gray-600"}`}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-pink-600 transition-colors duration-200 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div
                className={`transition-transform duration-300 ${menuOpen ? "rotate-90" : "rotate-0"}`}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ${menuOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 md:hidden shadow-2xl transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-pink-50">
          <Link
            to="/"
            className="flex items-center gap-2 text-pink-600 font-bold text-lg"
          >
            <ShoppingBag size={20} />
            সুক্রান গার্মেন্টস
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-500 hover:text-pink-600 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col px-5 py-4 gap-1">
          {[
            { to: "/", label: "হোম" },
            { to: "/about", label: "আমাদের সম্পর্কে" },
            { to: "/contact", label: "যোগাযোগ" },
            { to: "/track-order", label: "অর্ডার ট্র্যাক করুন" },
            { to: "/favorites", label: "❤️ ফেভারিট পণ্য" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-3 rounded-lg transition-all duration-200 font-medium ${isActive(to) ? "bg-pink-100 text-pink-600" : "text-gray-700 hover:bg-pink-50 hover:text-pink-600"}`}
            >
              {label}
            </Link>
          ))}

          {/* Category Section */}
          <div className="mt-3">
            <p className="text-xs text-gray-400 uppercase tracking-widest px-3 mb-2">
              পণ্য ক্যাটাগরি
            </p>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
            >
              সব পণ্য
            </Link>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className="w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
              >
                — {cat}
              </button>
            ))}
          </div>

          {/* WhatsApp */}
          <a
            href="https://wa.me/8801733633684"
            target="_blank"
            rel="noreferrer"
            className="mt-4 bg-green-500 text-white px-4 py-3 rounded-xl text-center font-medium hover:bg-green-600 transition-all duration-200"
          >
            📱 WhatsApp ট্র্যাক
          </a>
        </div>
      </div>
    </>
  );
}
