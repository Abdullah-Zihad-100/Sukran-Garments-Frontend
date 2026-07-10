import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAdmin } from "../../context/AdminContext";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, X } from "lucide-react";

const categories = ["শাড়ি", "জামা", "থ্রি-পিস", "সালোয়ার কামিজ"];

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const { token } = useAdmin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "শাড়ি",
    price: "",
    discountPrice: "",
    stock: "",
    images: [],
    description: "",
    fabric: "",
    embroidery: false,
    guarantee: false,
    sizes: [],
    colors: [],
    isNewStock: false,
  });

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`https://sukran-graments-frontend.onrender.com/api/products/${id}`)
        .then((res) => setForm({ ...res.data, images: res.data.images || [] }))
        .catch(() => toast.error("পণ্য লোড হয়নি"));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadLoading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          const res = await axios.post(
            "https://sukran-graments-frontend.onrender.com/api/upload",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            },
          );
          return res.data.url;
        }),
      );
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
      toast.success("ছবি আপলোড হয়েছে ✅");
    } catch {
      toast.error("ছবি আপলোড হয়নি");
    } finally {
      setUploadLoading(false);
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addColor = () => {
    if (colorInput.trim() && !form.colors.includes(colorInput.trim())) {
      setForm((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput("");
    }
  };

  const removeColor = (c) =>
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((x) => x !== c),
    }));

  const addSize = () => {
    if (sizeInput.trim() && !form.sizes.includes(sizeInput.trim())) {
      setForm((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }));
      setSizeInput("");
    }
  };

  const removeSize = (s) =>
    setForm((prev) => ({ ...prev, sizes: prev.sizes.filter((x) => x !== s) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast.error("কমপক্ষে একটি ছবি আপলোড করুন");
      return;
    }
    setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice
          ? Number(form.discountPrice)
          : undefined,
        stock: Number(form.stock),
      };

      if (isEdit) {
        await axios.put(
          `https://sukran-graments-frontend.onrender.com/api/products/${id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success("পণ্য আপডেট হয়েছে ✅");
      } else {
        await axios.post(
          "https://sukran-graments-frontend.onrender.com/api/products",
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        toast.success("পণ্য যোগ হয়েছে ✅");
      }
      navigate("/admin/products");
    } catch {
      toast.error("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/products")}
          className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? "পণ্য এডিট করুন" : "নতুন পণ্য যোগ করুন"}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            সব তথ্য সঠিকভাবে পূরণ করুন
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-800 border-b pb-3">
            মূল তথ্য
          </h2>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              পণ্যের নাম *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="যেমন: বেনারসি সিল্ক শাড়ি"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              ক্যাটাগরি *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                মূল্য (৳) *
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="1500"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                ছাড়ের মূল্য (৳)
              </label>
              <input
                name="discountPrice"
                type="number"
                value={form.discountPrice}
                onChange={handleChange}
                placeholder="1200"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                স্টক *
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
                placeholder="10"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              বিবরণ
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="পণ্যের বিস্তারিত বিবরণ"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              কাপড়ের ধরন
            </label>
            <input
              name="fabric"
              value={form.fabric}
              onChange={handleChange}
              placeholder="যেমন: সিল্ক, কটন, জর্জেট"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
          </div>
        </div>

        {/* Images Upload */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-800 border-b pb-3">
            ছবি আপলোড
          </h2>

          <div className="flex flex-wrap gap-3">
            {/* Uploaded Images */}
            {form.images.map((img, i) => (
              <div
                key={i}
                className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-gray-200 group"
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            <label className="w-28 h-28 border-2 border-dashed border-pink-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all duration-200">
              {uploadLoading ? (
                <span className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full" />
              ) : (
                <>
                  <Plus size={24} className="text-pink-400" />
                  <span className="text-xs text-pink-400 font-medium text-center">
                    ছবি যোগ করুন
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleImageUpload}
                disabled={uploadLoading}
              />
            </label>
          </div>
          <p className="text-xs text-gray-400">
            JPG, PNG, WEBP সাপোর্টেড। একসাথে একাধিক ছবি দেওয়া যাবে।
          </p>
        </div>

        {/* Colors & Sizes */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-gray-800 border-b pb-3">
            রং ও সাইজ
          </h2>

          {/* Colors */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              রং
            </label>
            <div className="flex gap-2 mb-3">
              <input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addColor())
                }
                placeholder="যেমন: লাল, কালো, সাদা"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              />
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:shadow-md transition"
              >
                যোগ
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.colors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 bg-pink-100 text-pink-600 px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => removeColor(c)}
                    className="hover:text-pink-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              সাইজ
            </label>
            <div className="flex gap-2 mb-3">
              <input
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSize())
                }
                placeholder="যেমন: S, M, L, XL, XXL"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:shadow-md transition"
              >
                যোগ
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.sizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-600 px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSize(s)}
                    className="hover:text-purple-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Extra Options */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 border-b pb-3 mb-4">
            অতিরিক্ত অপশন
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { name: "embroidery", label: "এমব্রয়ডারি আছে" },
              { name: "guarantee", label: "গ্যারান্টি আছে" },
              { name: "isNewStock", label: "নতুন স্টক হিসেবে দেখাবে" },
            ].map((opt) => (
              <label
                key={opt.name}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  name={opt.name}
                  checked={form[opt.name]}
                  onChange={handleChange}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${form[opt.name] ? "bg-gradient-to-r from-pink-500 to-purple-500 border-pink-500" : "border-gray-300 group-hover:border-pink-300"}`}
                >
                  {form[opt.name] && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                </div>
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploadLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
          ) : isEdit ? (
            "✅ পণ্য আপডেট করুন"
          ) : (
            "✅ পণ্য যোগ করুন"
          )}
        </button>
      </form>
    </div>
  );
}
