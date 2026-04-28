import React, { useEffect, useState } from "react";
import HomeHeader from "../Component/HomeHeader";
import { useAuth, API_BASE_URL, getAuthToken } from "../utils/authUtils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { PlusCircle, CheckCircle, Trash2, MapPin, Phone } from "lucide-react";

function LostFound() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all"); // all | lost | found
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    type: "lost",
    title: "",
    description: "",
    location: "",
    contact: "",
    image: null,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/lostfound/all`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPosts(data);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setSubmitting(true);
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("type", form.type);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("contact", form.contact);
      if (form.image) formData.append("image", form.image);

      const res = await fetch(`${API_BASE_URL}/lostfound/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post");

      setPosts((prev) => [data.post, ...prev]);
      setShowForm(false);
      setForm({ type: "lost", title: "", description: "", location: "", contact: "", image: null });
      toast.success("Post created successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (postId) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/lostfound/${postId}/resolve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to resolve");
      setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, resolved: true } : p)));
      toast.success("Marked as resolved!");
    } catch {
      toast.error("Failed to update post");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/lostfound/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const filtered = posts.filter((p) => filter === "all" || p.type === filter);

  return (
    <section className="bg-gradient-to-b from-[#fcfdfd] via-[#fffbee] to-[#f7f9ff] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen transition-colors duration-300">
      <HomeHeader />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-200">Lost & Found</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Report lost items or post items you've found on campus.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow transition"
          >
            <PlusCircle size={18} />
            {showForm ? "Cancel" : "Post Item"}
          </motion.button>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 shadow-sm space-y-4"
            >
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">New Post</h2>

              {/* Type toggle */}
              <div className="flex gap-3">
                {["lost", "found"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                      form.type === t
                        ? t === "lost"
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Title (e.g. Blue water bottle)"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                placeholder="Description — where/when lost or found, identifying features..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={3}
                className="w-full resize-none border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="text"
                  placeholder="Contact / WhatsApp (optional)"
                  value={form.contact}
                  onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                  className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">
                  Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.files[0] || null }))}
                  className="text-sm text-gray-700 dark:text-gray-200"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2.5 rounded-lg text-sm font-medium text-white transition ${
                  submitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {submitting ? "Posting..." : "Submit Post"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-5">
          {["all", "lost", "found"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            No posts yet. Be the first to post!
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((post) => {
              const isOwner = user && (user._id === post.user?._id || user.id === post.user?._id);
              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-5 transition-colors duration-300 ${
                    post.resolved
                      ? "border-green-200 dark:border-green-800 opacity-70"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            post.type === "lost"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                              : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          }`}
                        >
                          {post.type}
                        </span>
                        {post.resolved && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                            Resolved
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                          {post.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{post.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {post.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {post.location}
                          </span>
                        )}
                        {post.contact && (
                          <span className="flex items-center gap-1">
                            <Phone size={12} /> {post.contact}
                          </span>
                        )}
                        <span>
                          By {post.user?.name || "Unknown"} •{" "}
                          {new Date(post.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                  </div>

                  {isOwner && !post.resolved && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => handleResolve(post._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 transition"
                      >
                        <CheckCircle size={14} /> Mark Resolved
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 transition"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                  {isOwner && post.resolved && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 transition"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default LostFound;
