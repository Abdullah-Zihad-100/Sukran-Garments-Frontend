import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAdmin } from "../../context/AdminContext";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ProductList() {
  const { token } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}//
        `, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("পণ্য ডিলিট হয়েছে ✅");
      setDeleteId(null);
      fetchProducts();
    } catch {
      toast.error("ডিলিট হয়নি");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            পণ্য লিস্ট
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            মোট {products.length}টি পণ্য
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-sm w-full sm:w-auto"
        >
          <Plus size={18} /> নতুন পণ্য
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-12 text-gray-400 text-sm">
          কোনো পণ্য নেই
        </div>
      ) : (
        <>
          {/* Mobile card view - only visible below md breakpoint */}
          <div className="flex flex-col gap-3 md:hidden">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        👗
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {p.name}
                    </p>
                    <span className="inline-block mt-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-lg text-xs font-medium">
                      {p.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <p className="font-bold text-pink-500">
                      ৳{p.discountPrice || p.price}
                    </p>
                    {p.discountPrice && (
                      <p className="text-gray-400 text-xs line-through">
                        ৳{p.price}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`font-medium ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}
                    >
                      স্টক: {p.stock}টি
                    </span>
                    {p.isNewStock ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                        নতুন
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">
                        পুরাতন
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                  <Link
                    to={`/admin/products/edit/${p._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg py-2 text-sm font-medium transition-colors"
                  >
                    <Pencil size={14} /> এডিট
                  </Link>
                  <button
                    onClick={() => setDeleteId(p._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg py-2 text-sm font-medium transition-colors"
                  >
                    <Trash2 size={14} /> ডিলিট
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view - hidden below md breakpoint, unchanged */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      পণ্য
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      ক্যাটাগরি
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      মূল্য
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      স্টক
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      নতুন
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                            {p.images?.[0] ? (
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">
                                👗
                              </div>
                            )}
                          </div>
                          <p className="font-medium text-gray-800">{p.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-pink-500">
                          ৳{p.discountPrice || p.price}
                        </p>
                        {p.discountPrice && (
                          <p className="text-gray-400 text-xs line-through">
                            ৳{p.price}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}
                        >
                          {p.stock}টি
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.isNewStock ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">
                            হ্যাঁ
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-lg text-xs">
                            না
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/edit/${p._id}`}
                            className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(p._id)}
                            className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-gray-800 text-lg mb-2">
              পণ্য ডিলিট করবেন?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              এই পণ্যটি স্থায়ীভাবে মুছে যাবে।
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition"
              >
                ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
