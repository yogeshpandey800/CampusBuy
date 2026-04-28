import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import HomeHeader from "../Component/HomeHeader";
import {
  deleteProduct,
  deleteUser,
  fetchAdminStats,
  fetchAllProducts,
  fetchAllUsers,
} from "../utils/adminSlice";
import { API_BASE_URL, getAuthToken } from "../utils/authUtils";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((store) => store.user);
  const { stats, users, products, loading, error } = useSelector((store) => store.admin);
  const [activeTab, setActiveTab] = useState("users");
  const [confirmUserId, setConfirmUserId] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAllUsers());
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === "feedback") {
      fetchFeedbacks();
    }
  }, [activeTab]);

  const fetchFeedbacks = async () => {
    setFeedbackLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/feedback/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch feedback");
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      toast.error("Failed to load feedback");
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const canDeleteUser = (user) =>
    user.role !== "admin" && user._id !== (currentUser?._id || currentUser?.id);

  const tabClass = (isActive) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white"
        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  const preparedProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        sellerName: product.user?.name || "Unknown",
      })),
    [products]
  );

  return (
    <section className="bg-gradient-to-b from-[#fcfdfd] via-[#fffbee] to-[#f7f9ff] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen transition-colors duration-300">
      <HomeHeader />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-200 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-colors duration-300">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
            <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">
              {stats.totalUsers}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-colors duration-300">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
              {stats.totalProducts}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm transition-colors duration-300">
            <p className="text-sm text-gray-500 dark:text-gray-400">Feedback / Complaints</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-300 mt-1">
              {feedbacks.length > 0 ? feedbacks.length : "—"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button className={tabClass(activeTab === "users")} onClick={() => setActiveTab("users")}>
            Users
          </button>
          <button
            className={tabClass(activeTab === "products")}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={tabClass(activeTab === "feedback")}
            onClick={() => setActiveTab("feedback")}
          >
            Feedback / Complaints
          </button>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
          {loading && <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading...</div>}

          {!loading && activeTab === "users" && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{user.name || "-"}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          disabled={!canDeleteUser(user)}
                          onClick={() => setConfirmUserId(user._id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            canDeleteUser(user)
                              ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                          }`}
                        >
                          Remove User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && activeTab === "products" && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3">Title</th>
                    <th className="text-left px-4 py-3">Price</th>
                    <th className="text-left px-4 py-3">Category</th>
                    <th className="text-left px-4 py-3">Seller</th>
                    <th className="text-left px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {preparedProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{product.title}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{product.price}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 capitalize">
                        {product.category || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{product.sellerName}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={async () => {
                            if (!window.confirm("Delete this product?")) return;
                            const result = await dispatch(deleteProduct(product._id));
                            if (!result.error) toast.success("Product deleted successfully");
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 transition-colors"
                        >
                          Delete Product
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="overflow-x-auto">
              {feedbackLoading ? (
                <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading feedback...</div>
              ) : feedbacks.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">No feedback submitted yet.</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900/60 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3">Name</th>
                      <th className="text-left px-4 py-3">Email</th>
                      <th className="text-left px-4 py-3">Rating</th>
                      <th className="text-left px-4 py-3">Liked</th>
                      <th className="text-left px-4 py-3">Improve</th>
                      <th className="text-left px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.map((fb) => (
                      <tr
                        key={fb._id}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{fb.name || "Anonymous"}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{fb.email || "-"}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{fb.rating ? `${fb.rating}/5` : "-"}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[160px] truncate">{fb.like || "-"}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">{fb.improve}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(fb.createdAt).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for user delete */}
      {confirmUserId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-lg transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Confirm deletion</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Are you sure you want to delete this user and all their products?
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setConfirmUserId(null)}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const result = await dispatch(deleteUser(confirmUserId));
                  if (!result.error) toast.success("User deleted successfully");
                  setConfirmUserId(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
