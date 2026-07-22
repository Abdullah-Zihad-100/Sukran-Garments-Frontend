import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Heart,
  CheckCircle,
  Truck,
  RotateCcw,
  Shield,
  Phone,
  X,
  Package,
  Plus,
  Minus,
} from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { Helmet } from "react-helmet-async";

export default function ProductDetail() {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deliveryArea, setDeliveryArea] = useState("inside");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
  });

  const [leadSaved, setLeadSaved] = useState(false);

  // ইনকমপ্লিট অর্ডার (Lead) সেভ করার ফাংশন
  const saveIncompleteOrder = async (currentForm = form) => {
    // যদি নাম এবং ফোন নাম্বার (ন্যূনতম ১১ ডিজিট) না থাকে, তবে সেভ হবে না
    if (!currentForm.customerName || currentForm.phone.length < 11) return;
    if (!product) return;

    try {
      console.log("📤 Saving Incomplete Order...", currentForm);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/incomplete-orders`,
        {
          customerName: currentForm.customerName,
          phone: currentForm.phone,
          address: currentForm.address || "ঠিকানা দেওয়া হয়নি", // অ্যাড্রেস শুরুতে অপশনাল রাখা হয়েছে
          product: product._id,
          productName: product.name,
        },
      );

      console.log("✅ Lead Saved Successfully", res.data);
      setLeadSaved(true);
    } catch (err) {
      console.log("❌ Lead Save Failed", err);
    }
  };

  const [orderItems, setOrderItems] = useState([
    { color: "", size: "", quantity: 1 },
  ]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.colors?.length > 0) {
          setOrderItems([
            {
              color: res.data.colors[0],
              size: res.data.sizes?.[0] || "",
              quantity: 1,
            },
          ]);
        }
      })
      .catch(() => toast.error("পণ্য লোড হয়নি"))
      .finally(() => setLoading(false));
  }, [id]);

  const addOrderItem = () => {
    setOrderItems((prev) => [
      ...prev,
      {
        color: product?.colors?.[0] || "",
        size: product?.sizes?.[0] || "",
        quantity: 1,
      },
    ]);
  };

  const removeOrderItem = (index) => {
    if (orderItems.length === 1) return;
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index, field, value) => {
    setOrderItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const unitPrice = product?.discountPrice || product?.price || 0;
  const deliveryCharge = deliveryArea === "inside" ? 80 : 150;
  const totalPrice = unitPrice * totalQuantity + deliveryCharge;

  const handleOrder = async () => {
    if (!form.customerName || !form.phone || !form.address) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    for (const item of orderItems) {
      if (product.colors?.length > 0 && !item.color) {
        toast.error("সব আইটেমে রং সিলেক্ট করুন");
        return;
      }
      if (product.sizes?.length > 0 && !item.size) {
        toast.error("সব আইটেমে সাইজ সিলেক্ট করুন");
        return;
      }
    }

    setOrderLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        ...form,
        product: product._id,
        productName: product.name,
        selectedColor: orderItems
          .map(
            (i) => `${i.color}${i.size ? ` (${i.size})` : ""} x${i.quantity}`,
          )
          .join(", "),
        selectedSize: orderItems
          .map((i) => i.size)
          .filter(Boolean)
          .join(", "),
        quantity: totalQuantity,
        totalPrice,
        orderItems,
      });
      setOrderSuccess(res.data.order);
      setLeadSaved(false);
      setForm({ customerName: "", phone: "", address: "" });
      setOrderItems([
        {
          color: product.colors?.[0] || "",
          size: product.sizes?.[0] || "",
          quantity: 1,
        },
      ]);
    } catch {
      toast.error("অর্ডার হয়নি, আবার চেষ্টা করুন");
      setLeadSaved(true);
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        পণ্য পাওয়া যায়নি
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sukran Garments</title>
        <meta
          name="description"
          content={`${product.name} - ${product.price} টাকা। সেরা মানের কাপড়, সারাদেশে হোম ডেলিভারি।`}
        />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.images?.[selectedImage]} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm text-gray-500">
        <Link to="/" className="text-pink-500 hover:underline">
          হোম
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="text-pink-500 hover:underline">
          পণ্য
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Images */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm aspect-square">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  👗
                </div>
              )}
              {product.discountPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                  -
                  {Math.round(
                    (1 - product.discountPrice / product.price) * 100,
                  )}
                  % ছাড়
                </div>
              )}
              <button
                onClick={() => toggleFavorite(product)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Heart
                  size={20}
                  className={
                    isFavorite(product._id)
                      ? "fill-pink-500 text-pink-500"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === i ? "border-pink-500 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-5">
            {/* Product Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <p className="text-sm text-purple-500 font-medium mb-1">
                {product.category}
              </p>
              <h1 className="text-2xl font-bold text-gray-800 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-pink-500">
                  ৳{product.discountPrice || product.price}
                </span>
                {product.discountPrice && (
                  <span className="text-gray-400 text-lg line-through">
                    ৳{product.price}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-4">
                <CheckCircle size={16} /> স্টক আছে ({product.stock}টি)
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                {product.fabric && (
                  <p>
                    🧵 কাপড়:{" "}
                    <span className="font-medium text-gray-800">
                      {product.fabric}
                    </span>
                  </p>
                )}
                {product.embroidery && (
                  <p>
                    ✨ এমব্রয়ডারি:{" "}
                    <span className="font-medium text-gray-800">আছে</span>
                  </p>
                )}
                {product.guarantee && (
                  <p>
                    🛡️ গ্যারান্টি:{" "}
                    <span className="font-medium text-gray-800">আছে</span>
                  </p>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100">
                {[
                  { icon: <Truck size={16} />, label: "দ্রুত ডেলিভারি" },
                  { icon: <Shield size={16} />, label: "ক্যাশ অন ডেলিভারি" },
                  { icon: <CheckCircle size={16} />, label: "১০০% অরিজিনাল" },
                  { icon: <RotateCcw size={16} />, label: "সহজ রিটার্ন" },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <div className="text-pink-500">{b.icon}</div>
                    <span className="text-xs text-gray-500">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  🎨 রং, সাইজ ও পরিমাণ
                </h3>
                <button
                  onClick={addOrderItem}
                  className="flex items-center gap-1 text-pink-500 text-sm font-medium hover:text-pink-600 transition bg-pink-50 px-3 py-1.5 rounded-lg"
                >
                  <Plus size={14} /> আরো যোগ করুন
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 relative"
                  >
                    {orderItems.length > 1 && (
                      <button
                        onClick={() => removeOrderItem(index)}
                        className="absolute top-3 right-3 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition"
                      >
                        <X size={12} />
                      </button>
                    )}

                    <p className="text-xs font-semibold text-gray-500 mb-3">
                      আইটেম {index + 1}
                    </p>

                    <div className="flex flex-col gap-3">
                      {/* Color */}
                      {product.colors?.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-2">রং:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.colors.map((color, colorIdx) => (
                              <button
                                key={color}
                                onClick={() => {
                                  updateOrderItem(index, "color", color);
                                  if (product.images?.[colorIdx]) {
                                    setSelectedImage(colorIdx);
                                  }
                                }}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                                  item.color === color
                                    ? "border-pink-500 bg-pink-50 text-pink-600"
                                    : "border-gray-200 text-gray-600 hover:border-pink-300"
                                }`}
                              >
                                {product.images?.[colorIdx] && (
                                  <img
                                    src={product.images[colorIdx]}
                                    alt={color}
                                    className="w-10 h-10 rounded-md object-cover border border-gray-100 shrink-0"
                                  />
                                )}
                                <span>{color}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Size */}
                      {product.sizes?.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-2">সাইজ:</p>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() =>
                                  updateOrderItem(index, "size", size)
                                }
                                className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${item.size === size ? "border-pink-500 bg-pink-50 text-pink-600" : "border-gray-200 text-gray-600 hover:border-pink-300"}`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quantity */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2">পরিমাণ:</p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateOrderItem(
                                index,
                                "quantity",
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="w-8 h-8 bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 rounded-lg flex items-center justify-center transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-gray-800 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateOrderItem(
                                index,
                                "quantity",
                                item.quantity + 1,
                              )
                            }
                            className="w-8 h-8 bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 rounded-lg flex items-center justify-center transition"
                          >
                            <Plus size={14} />
                          </button>
                          <span className="text-sm text-gray-500">
                            = ৳{unitPrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Form */}
            <div id="order-form" className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                📦 ডেলিভারি তথ্য
              </h3>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      placeholder="আপনার পূর্ণ নাম"
                      value={form.customerName}
                      onChange={(e) => {
                        const updatedForm = {
                          ...form,
                          customerName: e.target.value,
                        };
                        setForm(updatedForm);
                        if (updatedForm.phone.length >= 11) {
                          saveIncompleteOrder(updatedForm);
                        }
                      }}
                      onBlur={() => saveIncompleteOrder(form)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      মোবাইল নাম্বার *
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={form.phone}
                      onChange={(e) => {
                        const updatedForm = { ...form, phone: e.target.value };
                        setForm(updatedForm);
                        if (updatedForm.phone.length === 11) {
                          saveIncompleteOrder(updatedForm);
                        }
                      }}
                      onBlur={() => saveIncompleteOrder(form)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    সম্পূর্ণ ঠিকানা *
                  </label>
                  <textarea
                    placeholder="বাড়ি, রোড, এলাকা, থানা, জেলা"
                    value={form.address}
                    onChange={(e) => {
                      const updatedForm = { ...form, address: e.target.value };
                      setForm(updatedForm);
                    }}
                    onBlur={() => saveIncompleteOrder(form)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition resize-none"
                  />
                </div>

                {/* Delivery Area */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">
                    ডেলিভারি এলাকা *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDeliveryArea("inside")}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${deliveryArea === "inside" ? "border-pink-500 bg-pink-50 text-pink-600" : "border-gray-200 text-gray-600 hover:border-pink-300"}`}
                    >
                      ঢাকার ভিতরে
                      <br />
                      <span className="text-pink-500 font-bold">৳80</span>
                    </button>
                    <button
                      onClick={() => setDeliveryArea("outside")}
                      className={`py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${deliveryArea === "outside" ? "border-pink-500 bg-pink-50 text-pink-600" : "border-gray-200 text-gray-600 hover:border-pink-300"}`}
                    >
                      ঢাকার বাইরে
                      <br />
                      <span className="text-pink-500 font-bold">৳150</span>
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    🧾 অর্ডার সামারি
                  </h4>
                  <div className="flex flex-col gap-2 text-sm">
                    {orderItems.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-gray-600"
                      >
                        <span>
                          {item.color} {item.size ? `/ ${item.size}` : ""} ×{" "}
                          {item.quantity}
                        </span>
                        <span>৳{unitPrice * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-2">
                      <span>ডেলিভারি চার্জ</span>
                      <span>৳{deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2">
                      <span>মোট ({totalQuantity}টি)</span>
                      <span className="text-pink-500">৳{totalPrice}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={orderLoading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 rounded-xl font-bold text-base transition-all duration-200 hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {orderLoading ? (
                    <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    "✅ অর্ডার কনফার্ম করুন - ক্যাশ অন ডেলিভারি"
                  )}
                </button>
                <p className="text-center text-xs text-gray-400">
                  পণ্য পেয়ে সম্পূর্ণ পরিশোধ | ১০০% অরিজিনাল পণ্য
                </p>
              </div>
            </div>

            {/* Call */}
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">প্রয়োজনে কল করুন</p>
              <a
                href="tel:+8801405925125"
                className="inline-flex items-center gap-2 text-pink-500 font-bold text-lg hover:text-pink-600 transition"
              >
                <Phone size={20} /> 01405925125
              </a>
            </div>

            {product.description && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">
                  বিবরণ
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white text-center relative">
              <button
                onClick={() => setOrderSuccess(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package size={32} className="text-white" />
              </div>
              <h2 className="text-xl font-bold">অর্ডার সফল হয়েছে! 🎉</h2>
              <p className="text-pink-100 text-sm mt-1">
                আপনার অর্ডার কনফার্ম করা হয়েছে
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-4">
              {/* Order Details */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">পণ্যের নাম</span>
                  <span className="font-medium text-gray-800">
                    {orderSuccess.productName}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">মোট মূল্য</span>
                  <span className="font-bold text-pink-500">
                    ৳{orderSuccess.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">পরিমাণ</span>
                  <span className="font-medium text-gray-800">
                    {orderSuccess.quantity}টি
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">স্ট্যাটাস</span>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-lg text-xs font-medium">
                    অপেক্ষমান
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">পেমেন্ট</span>
                  <span className="font-medium text-gray-800">
                    ক্যাশ অন ডেলিভারি
                  </span>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-blue-700 text-sm font-medium">
                  📞 অর্ডার কনফার্ম করতে আমাদের কাস্টমার সার্ভিস থেকে আপনাকে কল
                  দেওয়া হবে।
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setOrderSuccess(null)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
                >
                  বন্ধ করুন
                </button>
                <Link
                  to="/track-order"
                  onClick={() => setOrderSuccess(null)}
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl text-sm font-medium text-center hover:shadow-md transition"
                >
                  অর্ডার ট্র্যাক করুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
