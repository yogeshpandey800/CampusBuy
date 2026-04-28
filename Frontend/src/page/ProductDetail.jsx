import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, MessageCircle, ChevronLeft, ChevronRight, MapPin, Tag, Package, Calendar } from "lucide-react";
import HomeHeader from "../Component/HomeHeader";
import { useWishlist } from "../context/WishlistContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [wishAnimating, setWishAnimating] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load product");
        setLoading(false);
      });
  }, [id]);

  const handleContact = () => {
    const whatsapp = product?.user?.whatsapp;
    if (!whatsapp) {
      alert("Seller has not provided WhatsApp contact information");
      return;
    }
    const clean = whatsapp.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(`Hi! I'm interested in your product: ${product.title}`);
    window.open(`https://wa.me/${clean}?text=${msg}`, "_blank");
  };

  const prevImage = () => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImage = () => setActiveImage((i) => (i + 1) % product.images.length);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, product]);

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-[#fcfdfd] via-[#fffbee] to-[#f7f9ff] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen transition-colors duration-300">
        <HomeHeader />
        <div className="flex items-center justify-center py-32">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
          />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="bg-gradient-to-b from-[#fcfdfd] via-[#fffbee] to-[#f7f9ff] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen transition-colors duration-300">
        <HomeHeader />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Package size={56} className="text-gray-300" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">{error || "Product not found"}</p>
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-indigo-600 hover:underline text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to marketplace
          </button>
        </div>
      </section>
    );
  }

  const wishlisted = isWishlisted(product._id);
  const images = product.images?.length > 0 ? product.images : [];
  const isNew = new Date(product.createdAt).getTime() > Date.now() - 86400000;

  return (
    <section className="bg-gradient-to-b from-[#fcfdfd] via-[#fffbee] to-[#f7f9ff] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen transition-colors duration-300">
      <HomeHeader />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            {images.length > 1 && (
              <button
                className="absolute left-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white z-10"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
              >
                <ChevronLeft size={28} />
              </button>
            )}
            <motion.img
              key={activeImage}
              src={images[activeImage]}
              alt={product.title}
              className="max-w-[92vw] max-h-[88vh] rounded-xl object-contain"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <button
                className="absolute right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white z-10"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
              >
                <ChevronRight size={28} />
              </button>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-5 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {activeImage + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-5 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Images ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square shadow-md">
              {images.length > 0 ? (
                <>
                  <motion.img
                    key={activeImage}
                    src={images[activeImage]}
                    alt={product.title}
                    className="w-full h-full object-cover cursor-zoom-in"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setLightboxOpen(true)}
                  />
                  {/* Prev / Next arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-900/70 hover:bg-white dark:hover:bg-gray-800 rounded-full p-1.5 shadow transition"
                      >
                        <ChevronLeft size={20} className="text-gray-700 dark:text-gray-200" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-900/70 hover:bg-white dark:hover:bg-gray-800 rounded-full p-1.5 shadow transition"
                      >
                        <ChevronRight size={20} className="text-gray-700 dark:text-gray-200" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                        {activeImage + 1} / {images.length}
                      </div>
                    </>
                  )}
                  {isNew && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      NEW
                    </span>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      i === activeImage
                        ? "border-indigo-500 shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Right: Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            {/* Title + wishlist */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {product.title}
              </h1>
              <motion.button
                whileTap={{ scale: 0.85 }}
                animate={wishAnimating ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.25 }}
                onAnimationComplete={() => setWishAnimating(false)}
                onClick={async () => {
                  setWishAnimating(true);
                  await toggleWishlist(product._id);
                }}
                className={`flex-shrink-0 p-2.5 rounded-full shadow border transition ${
                  wishlisted
                    ? "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800"
                    : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600"
                }`}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  size={22}
                  className={`transition-colors duration-300 ${
                    wishlisted ? "fill-red-500 text-red-500" : "text-gray-400 dark:text-gray-300"
                  }`}
                />
              </motion.button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              {product.negotiable && (
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  Negotiable
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.category && (
                <span className="flex items-center gap-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full capitalize">
                  <Tag size={11} /> {product.category}
                </span>
              )}
              {product.condition && (
                <span className="flex items-center gap-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full capitalize">
                  <Package size={11} /> {product.condition}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                <Calendar size={11} />
                {new Date(product.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </span>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Seller card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4">
              <img
                src={
                  product.user?.profileImage ||
                  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                alt={product.user?.name || "Seller"}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-700 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {product.user?.name || "Unknown Seller"}
                </p>
                {product.user?.branch && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {product.user.branch}
                  </p>
                )}
                {product.user?.email && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                    {product.user.email}
                  </p>
                )}
              </div>
            </div>

            {/* Contact button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleContact}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl shadow-md transition-colors text-base"
            >
              <MessageCircle size={20} />
              Contact Seller on WhatsApp
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
