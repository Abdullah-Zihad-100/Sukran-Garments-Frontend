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

  // নতুন ডাটা স্ট্রাকচার: { [colorName]: { [size]: quantity } }
  // উদাহরণ: { "সবুজ": { "40": 1, "42": 2 }, "লাল": { "M": 1 } }
  const [selectedColors, setSelectedColors] = useState({});

  // ইনকমপ্লিট অর্ডার (Lead) সেভ করার ফাংশন
  const saveIncompleteOrder = async (currentForm = form) => {
    if (!currentForm.customerName || currentForm.phone.length < 11) return;
    if (!product) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/incomplete-orders`, {
        customerName: currentForm.customerName,
        phone: currentForm.phone,
        address: currentForm.address || "ঠিকানা দেওয়া হয়নি",
        product: product._id,
        productName: product.name,
      });
      setLeadSaved(true);
    } catch (err) {
      console.log("❌ Lead Save Failed", err);
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => {
        const prod = res.data;
        setProduct(prod);

        const initialColor =
          prod.colors?.length > 0 ? prod.colors[0] : "_default";
        const initialSize = prod.sizes?.length > 0 ? prod.sizes[0] : "_nosize";

        setSelectedColors({
          [initialColor]: {
            [initialSize]: 1,
          },
        });
      })
      .catch(() => toast.error("পণ্য লোড হয়নি"))
      .finally(() => setLoading(false));
  }, [id]);

  // রং টগল (চেক/আনচেক) করা
  const toggleColor = (colorKey, colorIdx) => {
    setSelectedColors((prev) => {
      const next = { ...prev };
      if (next[colorKey]) {
        delete next[colorKey];
      } else {
        const defaultSize = product?.sizes?.[0] || "_nosize";
        next[colorKey] = {
          [defaultSize]: 1,
        };
        if (product?.images?.[colorIdx]) {
          setSelectedImage(colorIdx);
        }
      }
      return next;
    });
  };

  // নির্দিষ্ট রং-এর ভেতরে সাইজ সিলেক্ট/ডিসিলেক্ট (টগল) করা
  const toggleSizeForColor = (colorKey, size) => {
    setSelectedColors((prev) => {
      const colorSizes = prev[colorKey] ? { ...prev[colorKey] } : {};

      if (colorSizes[size]) {
        // একাধিক সাইজ থাকলে ডিসিলেক্ট করা যাবে, অন্তত ১টি রাখতে চাইলে চেক দিয়ে দিতে পারেন
        delete colorSizes[size];
      } else {
        colorSizes[size] = 1; // নতুন সাইজ যোগ করলে ডিফল্ট ১
      }

      return {
        ...prev,
        [colorKey]: colorSizes,
      };
    });
  };

  // নির্দিষ্ট সাইজের কোয়ান্টিটি বাড়ানো/কমানো
  const updateQuantity = (colorKey, sizeKey, delta) => {
    setSelectedColors((prev) => {
      const colorSizes = { ...prev[colorKey] };
      const currentQty = colorSizes[sizeKey] || 1;
      const newQty = currentQty + delta;

      if (newQty <= 0) {
        delete colorSizes[sizeKey];
      } else {
        colorSizes[sizeKey] = newQty;
      }

      return {
        ...prev,
        [colorKey]: colorSizes,
      };
    });
  };

  // অর্ডার আইটেমস ক্যালকুলেশন
  const getOrderItems = () => {
    const items = [];
    Object.entries(selectedColors).forEach(([colorKey, sizesObj]) => {
      Object.entries(sizesObj).forEach(([sizeKey, quantity]) => {
        if (quantity > 0) {
          items.push({
            color: colorKey === "_default" ? "" : colorKey,
            size: sizeKey === "_nosize" ? "" : sizeKey,
            quantity,
          });
        }
      });
    });
    return items;
  };

  const orderItemsPayload = getOrderItems();
  const totalQuantity = orderItemsPayload.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const unitPrice = product?.discountPrice || product?.price || 0;
  const deliveryCharge = deliveryArea === "inside" ? 80 : 150;
  const totalPrice =
    unitPrice * totalQuantity + (totalQuantity > 0 ? deliveryCharge : 0);

  const handleOrder = async () => {
    if (!form.customerName || !form.phone || !form.address) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    if (totalQuantity === 0) {
      toast.error("কমপক্ষে একটি প্রোডাক্ট ও সাইজ সিলেক্ট করুন");
      return;
    }

    setOrderLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, {
        ...form,
        product: product._id,
        productName: product.name,
        selectedColor: orderItemsPayload
          .map(
            (i) => `${i.color}${i.size ? ` (${i.size})` : ""} x${i.quantity}`,
          )
          .join(", "),
        selectedSize: orderItemsPayload
          .map((i) => i.size)
          .filter(Boolean)
          .join(", "),
        quantity: totalQuantity,
        totalPrice,
        orderItems: orderItemsPayload,
      });
      setOrderSuccess(res.data.order);
      setLeadSaved(false);
      setForm({ customerName: "", phone: "", address: "" });

      const initialColor =
        product.colors?.length > 0 ? product.colors[0] : "_default";
      const initialSize =
        product.sizes?.length > 0 ? product.sizes[0] : "_nosize";
      setSelectedColors({
        [initialColor]: { [initialSize]: 1 },
      });
    } catch {
      toast.error("অর্ডার হয়নি, আবার চেষ্টা করুন");
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
        পণ্য পাওয়া যায়নি
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sukran Garments</title>
        <meta
          name="description"
          content={`${product.name} - ${product.price} টাকা। সেরা মানের কাপড়, সারাদেশে হোম ডেলিভারি।`}
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
                  % ছাড়
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
                    🧵 কাপড়:{" "}
                    <span className="font-medium text-gray-800">
                      {product.fabric}
                    </span>
                  </p>
                )}
                {product.embroidery && (
                  <p>
                    ✨ এমব্রয়ডারি:{" "}
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

            {/* Color + Size Selection */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                🎨 রং ও সাইজ নির্বাচন করুন
              </h3>

              <div className="flex flex-col gap-4">
                {(product.colors?.length > 0 ? product.colors : [null]).map(
                  (color, colorIdx) => {
                    const isNoColor = color === null;
                    const colorKey = isNoColor ? "_default" : color;
                    const colorSelection = selectedColors[colorKey];
                    const isSelected = !!colorSelection;

                    return (
                      <div
                        key={colorKey}
                        onClick={() =>
                          !isNoColor && toggleColor(colorKey, colorIdx)
                        }
                        className={`rounded-xl border-2 p-4 transition-all duration-200 ${
                          !isNoColor ? "cursor-pointer" : ""
                        } ${
                          isSelected
                            ? "border-pink-500 bg-pink-50/40"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            {!isNoColor && (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="w-5 h-5 accent-pink-500 rounded pointer-events-none shrink-0"
                              />
                            )}
                            <div className="flex items-center gap-2">
                              {!isNoColor && (
                                <span className="font-semibold text-gray-800">
                                  {color}
                                </span>
                              )}
                              <span className="text-sm">
                                {product.discountPrice && (
                                  <span className="line-through text-gray-400 mr-1">
                                    ৳{product.price}
                                  </span>
                                )}
                                <span className="font-bold text-pink-500">
                                  ৳{unitPrice}
                                </span>
                              </span>
                            </div>
                          </div>
                          {!isNoColor && product.images?.[colorIdx] && (
                            <img
                              src={product.images[colorIdx]}
                              alt={color}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                            />
                          )}
                        </div>

                        {isSelected && (
                          <div
                            className="mt-4 flex flex-col gap-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {product.sizes?.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 mb-2">
                                  সাইজ (একাধিক নির্বাচন করা যাবে):
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {product.sizes.map((size) => {
                                    const isSizeActive = !!colorSelection[size];
                                    return (
                                      <button
                                        key={size}
                                        onClick={() =>
                                          toggleSizeForColor(colorKey, size)
                                        }
                                        className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                                          isSizeActive
                                            ? "border-pink-500 bg-pink-50 text-pink-600"
                                            : "border-gray-200 text-gray-600 hover:border-pink-300"
                                        }`}
                                      >
                                        {size}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-col gap-2 mt-2">
                              {Object.entries(colorSelection).map(
                                ([sizeKey, qty]) => (
                                  <div
                                    key={sizeKey}
                                    className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm"
                                  >
                                    <p className="text-sm font-medium text-gray-700">
                                      {sizeKey !== "_nosize"
                                        ? `সাইজ: ${sizeKey}`
                                        : "আইটেম"}
                                    </p>
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() =>
                                          updateQuantity(colorKey, sizeKey, -1)
                                        }
                                        className="w-8 h-8 bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 rounded-lg flex items-center justify-center transition"
                                      >
                                        <Minus size={14} />
                                      </button>
                                      <span className="font-bold text-gray-800 w-6 text-center">
                                        {qty}
                                      </span>
                                      <button
                                        onClick={() =>
                                          updateQuantity(colorKey, sizeKey, 1)
                                        }
                                        className="w-8 h-8 bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-600 rounded-lg flex items-center justify-center transition"
                                      >
                                        <Plus size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>

              <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-sm font-medium text-gray-600">
                  নির্বাচিত: {totalQuantity} টি
                </span>
                <span className="font-bold text-pink-500">
                  ৳{unitPrice * totalQuantity}
                </span>
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
                    {orderItemsPayload.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-gray-600"
                      >
                        <span>
                          {item.color}
                          {item.size ? ` (${item.size})` : ""} × {item.quantity}
                        </span>
                        <span>৳{unitPrice * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-2">
                      <span>সাবটোটাল</span>
                      <span>৳{unitPrice * totalQuantity}</span>
                    </div>
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
                  পণ্য পেয়ে সম্পূর্ণ পরিশোধ | ১০০% অরিজিনাল পণ্য
                </p>
              </div>
            </div>

            {/* Call */}
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">প্রয়োজনে কল করুন</p>
              <a
                href="tel:+8801629450724"
                className="inline-flex items-center gap-2 text-pink-500 font-bold text-lg hover:text-pink-600 transition"
              >
                <Phone size={20} />
                01629450724
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
              <h2 className="text-xl font-bold">অর্ডার সফল হয়েছে! 🎉</h2>
              <p className="text-pink-100 text-sm mt-1">
                আপনার অর্ডার কনফার্ম করা হয়েছে
              </p>
            </div>

            <div className="p-6 flex flex-col gap-4">
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

              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-blue-700 text-sm font-medium">
                  📞 অর্ডার কনফার্ম করতে আমাদের কাস্টমার সার্ভিস থেকে আপনাকে কল
                  দেওয়া হবে।
                </p>
              </div>

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
