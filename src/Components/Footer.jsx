import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Top Gradient Bar */}
      <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500" />

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-bold text-2xl"
          >
            {" "}
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
                  fill="#ffffff"
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
          <p className="text-sm text-gray-400 leading-relaxed">
            বাংলাদেশের সেরা পোশাক অনলাইন স্টোর। আমরা গুণমান এবং সাশ্রয়ী মূল্যে
            বিশ্বাস করি।
          </p>

          {/* Contact Info */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-3 text-gray-400 hover:text-white transition group">
              <div className="w-8 h-8 bg-slate-800 group-hover:bg-pink-500 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200">
                <MapPin
                  size={14}
                  className="text-pink-400 group-hover:text-white"
                />
              </div>
              <span className="mt-1">
                Kamrangir Char, Dhaka Division, Bangladesh
              </span>
            </div>
            <a
              href="tel:+8801733633684"
              className="flex items-center gap-3 text-gray-400 hover:text-white transition group"
            >
              <div className="w-8 h-8 bg-slate-800 group-hover:bg-pink-500 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200">
                <Phone
                  size={14}
                  className="text-pink-400 group-hover:text-white"
                />
              </div>
              01405925125
            </a>
            <a
              href="mailto:sukrangarments@gmail.com"
              className="flex items-center gap-3 text-gray-400 hover:text-white transition group"
            >
              <div className="w-8 h-8 bg-slate-800 group-hover:bg-pink-500 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200">
                <Mail
                  size={14}
                  className="text-pink-400 group-hover:text-white"
                />
              </div>
              sukrangarments@gmail.com
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-5">
          <h3 className="text-white font-semibold text-lg">দ্রুত লিংক</h3>
          <div className="w-10 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
          <ul className="flex flex-col gap-2.5 text-sm">
            {[
              { to: "/", label: "হোম" },
              { to: "/products", label: "সব পণ্য" },
              { to: "/about", label: "আমাদের কথা" },
              { to: "/contact", label: "যোগাযোগ" },
              { to: "/favorites", label: "ফেভারিট পণ্য" },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors duration-200 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Hours */}
        <div className="flex flex-col gap-5">
          <h3 className="text-white font-semibold text-lg">
            আমাদের সাথে যুক্ত হন
          </h3>
          <div className="w-10 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />

          {/* Social Icons */}
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/sukrangarments"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 bg-slate-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <FaFacebook size={18} color="white" />
            </a>

            <a
              href="https://wa.me/8801733633684"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 bg-slate-800 hover:bg-green-500 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-green-500/20"
            >
              <FaWhatsapp size={18} color="white" />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 bg-slate-800 hover:bg-pink-500 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20"
            >
              <FaInstagram size={18} color="white" />
            </a>
          </div>

          {/* Business Hours */}
          <div className="bg-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <h4 className="text-white font-medium text-sm">ব্যবসায়িক সময়</h4>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <div className="flex justify-between items-center">
                <span>সোমবার - শুক্রবার</span>
                <span className="text-pink-400 font-medium">
                  ৯:০০ AM - ৮:০০ PM
                </span>
              </div>
              <div className="w-full h-px bg-slate-700" />
              <div className="flex justify-between items-center">
                <span>শনি - রবি</span>
                <span className="text-pink-400 font-medium">
                  ১০:০০ AM - ৮:০০ PM
                </span>
              </div>
            </div>
          </div>

          {/* WhatsApp Button */}

          <a
            href="https://wa.me/8801733633684"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 w-fit"
          >
            <MessageCircle size={16} />
            WhatsApp ট্র্যাক করুন
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-center gap-2 text-xs text-gray-500">
          <p>© ২০২৬ সুক্রান গার্মেন্টস। সকল অধিকার সংরক্ষিত।</p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}

      <a
        href="https://wa.me/8801733633684"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-xl transition-all duration-200 hover:scale-110 z-50"
      >
        <FaWhatsapp size={26} color="white" />
      </a>
    </footer>
  );
}
