import { Link } from "react-router-dom";
import {
  CheckCircle,
  DollarSign,
  Zap,
  Shield,
  Headphones,
} from "lucide-react";
import Seo from "../components/Seo";

const stats = [
  { value: "১০০০+", label: "সন্তুষ্ট গ্রাহক" },
  { value: "৫০০+", label: "পণ্য সংগ্রহ" },
  { value: "৯৯%", label: "সন্তুষ্টির হার" },
  { value: "২৪/৭", label: "গ্রাহক সেবা" },
];

const values = [
  { label: "গুণমান", sub: "প্রতিটি পণ্য সর্বোচ্চ মানের" },
  { label: "সততা", sub: "স্বচ্ছ মূল্য নির্ধারণ" },
  { label: "সেবা", sub: "গ্রাহক সন্তুষ্টি আমাদের লক্ষ্য" },
];

const features = [
  {
    icon: <DollarSign size={22} className="text-blue-500" />,
    bg: "bg-blue-100",
    title: "সাশ্রয়ী মূল্য",
    sub: "সর্বোত্তম মূল্যে সেরা পণ্য",
  },
  {
    icon: <CheckCircle size={22} className="text-green-500" />,
    bg: "bg-green-100",
    title: "সহজ রিটার্ন",
    sub: "৩ দিনের মধ্যে সম্পূর্ণ রিটার্ন",
  },
  {
    icon: <Zap size={22} className="text-purple-500" />,
    bg: "bg-purple-100",
    title: "দ্রুত ডেলিভারি",
    sub: "২-৩ দিনে ঢাকায়",
  },
  {
    icon: <Shield size={22} className="text-pink-500" />,
    bg: "bg-pink-100",
    title: "সিকিউর পেমেন্ট",
    sub: "COD সুবিধা উপলব্ধ",
  },
  {
    icon: <Headphones size={22} className="text-yellow-500" />,
    bg: "bg-yellow-100",
    title: "২৪/৭ সাপোর্ট",
    sub: "সবসময় আমরা আছি",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Card */}
      <Seo
        title="আমাদের সম্পর্কে"
        description="Sukran Garments একটি বিশ্বস্ত অনলাইন পোশাক ব্র্যান্ড, যা সেরা মানের শাড়ি, থ্রি-পিস ও সালোয়ার কামিজ সরবরাহ করে সারাদেশে।"
        url="/about"
      />
      <div className="bg-gradient-to-r from-pink-600 to-purple-600  p-10  text-center text-white w-full mb-10">
        <h2 className="text-2xl font-bold mb-2">আজই শপিং শুরু করুন</h2>
        <p className="text-pink-100 mb-6">
          আমাদের সংগ্রহ থেকে আপনার পছন্দের পোশাক বেছে নিন
        </p>
        <Link
          to="/products"
          className="inline-block bg-white text-pink-500 font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          শপিং শুরু করুন
        </Link>
      </div>
      <div className="pb-16 mx-auto max-w-5xl px-4 flex flex-col gap-8">
        {/* Story & Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Story */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              আমাদের গল্প
            </h2>
            <div className="flex flex-col gap-3 text-gray-600 text-sm leading-relaxed">
              <p>
                সুক্রান গার্মেন্টস শুরু হয়েছিল একটি সাধারণ স্বপ্ন থেকে —
                বাংলাদেশের প্রতিটি গ্রাহকের কাছে সুন্দর, মানসম্পন্ন পোশাক পৌঁছে
                দেওয়া।
              </p>
              <p>
                আজ আমরা গর্বিত যে হাজারেরও বেশি সন্তুষ্ট গ্রাহক আমাদের সেবা
                নিচ্ছেন।
              </p>
              <p>
                আমাদের প্রতিটি পণ্য সযত্নে নির্বাচিত এবং গুণমান নিশ্চিত করে
                সরবরাহ করা হয়।
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-pink-50 rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              আমাদের মূল্যবোধ
            </h2>
            <div className="flex flex-col gap-4">
              {values.map((v, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle
                    size={20}
                    className="text-pink-500 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{v.label}</p>
                    <p className="text-gray-500 text-sm">{v.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-6 text-center"
            >
              <p className="text-3xl font-bold text-pink-500 mb-1">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            কেন আমাদের বেছে নিন?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-3"
              >
                <div
                  className={`w-14 h-14 ${f.bg} rounded-full flex items-center justify-center`}
                >
                  {f.icon}
                </div>
                <p className="font-semibold text-gray-800">{f.title}</p>
                <p className="text-gray-500 text-xs">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
