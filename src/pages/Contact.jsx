import { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Truck,
  CreditCard,
  RotateCcw,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

const cards = [
  {
    icon: <Mail size={24} className="text-pink-500" />,
    bg: "bg-pink-100",
    title: "ইমেল",
    value: "sukrangarments@gmail.com",
    sub: null,
    link: "mailto:sukrangarments@gmail.com",
    linkText: null,
  },
  {
    icon: <Phone size={24} className="text-blue-500" />,
    bg: "bg-blue-100",
    title: "ফোন",
    value: "+8801733633684",
    sub: "09:00 AM - 09:00 PM",
    link: "tel:+8801733633684",
    linkText: null,
  },
  {
    icon: <MessageCircle size={24} className="text-green-500" />,
    bg: "bg-green-100",
    title: "WhatsApp",
    value: "+8801733633684",
    sub: null,
    link: "https://wa.me/8801733633684",
    linkText: "চ্যাট শুরু করুন",
  },
];

const faqs = [
  {
    icon: <Truck size={16} className="text-orange-500" />,
    q: "ডেলিভারি সময়?",
    a: "ঢাকায় ২-৩ দিন, বাইরে ৩-৫ দিন",
  },
  {
    icon: <CreditCard size={16} className="text-blue-500" />,
    q: "পেমেন্ট পদ্ধতি?",
    a: "শুধুমাত্র ক্যাশ অন ডেলিভারি",
  },
  {
    icon: <RotateCcw size={16} className="text-green-500" />,
    q: "রিটার্ন নীতি?",
    a: "৩ দিনের মধ্যে সম্পূর্ণ রিটার্ন",
  },
];

const hours = [
  { day: "সোমবার - শুক্রবার:", time: "09:00 AM - 08:00 PM" },
  { day: "শনি - রবি:", time: "10:00 AM - 08:00 PM" },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("বার্তা পাঠানো হয়েছে! ধন্যবাদ ✅");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">যোগাযোগ করুন</h1>
        <p className="text-pink-100">
          আমাদের কাছে কোনো প্রশ্ন বা পরামর্শ থাকলে আমাদের সাথে যোগাযোগ করুন।
          আমরা ২৪ ঘণ্টার মধ্যে সাড়া দেব।
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {cards.map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div
                className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-4`}
              >
                {card.icon}
              </div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm">{card.value}</p>
              {card.sub && (
                <p className="text-gray-400 text-xs mt-1">{card.sub}</p>
              )}
              {card.linkText && (
                <a
                  href={card.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-500 text-sm font-medium hover:underline mt-1 inline-block"
                >
                  {card.linkText}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              আমাদের কাছে বার্তা পাঠান
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  ইমেল <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  ফোন <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  বিষয় <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  বার্তা <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-300 transition resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block" />
                ) : (
                  <>
                    <Send size={18} /> বার্তা পাঠান
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Side */}
          <div className="flex flex-col gap-5">
            {/* Business Hours */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <Clock size={20} className="text-pink-500" />
                সরাসরি ব্যবসায়িক সময়
              </h3>
              <div className="flex flex-col gap-3">
                {hours.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-600 text-sm">{item.day}</span>
                    <span className="text-gray-800 font-medium text-sm">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4">
                সাধারণ প্রশ্ন
              </h3>
              <div className="flex flex-col gap-3">
                {faqs.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="mt-0.5">{item.icon}</div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{item.q}</span> {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-pink-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                দ্রুত সহায়তা প্রয়োজন?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                WhatsApp এ আমাদের সাথে সরাসরি যোগাযোগ করুন।
              </p>
              <a
                href="https://wa.me/8801733633684"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
              >
                <MessageCircle size={18} /> WhatsApp চ্যাট
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
