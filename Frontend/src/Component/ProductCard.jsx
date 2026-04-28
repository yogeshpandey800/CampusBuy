import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onImageClick, showWishlistButton = true }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const wishlisted = isWishlisted(product?._id);

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-colors duration-300 relative overflow-hidden flex flex-col cursor-pointer"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 8px 32px rgba(60,60,180,0.12)",
      }}
      transition={{ duration: 0.4, type: "spring" }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {new Date(product.createdAt).getTime() > Date.now() - 86400000 && (
        <motion.div
          className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow z-10"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          NEW
        </motion.div>
      )}

      {showWishlistButton && (
        <motion.button
          className={`absolute top-2 right-2 z-20 p-2 rounded-full shadow-md backdrop-blur-sm ${
            wishlisted ? "bg-red-50 dark:bg-red-950/50" : "bg-white/90 dark:bg-gray-700/90"
          }`}
          whileTap={{ scale: 0.85 }}
          animate={isAnimating ? { scale: [1, 1.25, 1] } : {}}
          transition={{ duration: 0.25 }}
          onAnimationComplete={() => setIsAnimating(false)}
          onClick={async (e) => {
            e.stopPropagation();
            setIsAnimating(true);
            await toggleWishlist(product._id);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={20}
            className={`transition-colors duration-300 ${
              wishlisted ? "fill-red-500 text-red-500" : "text-gray-500 dark:text-gray-300"
            }`}
          />
        </motion.button>
      )}

      {product.images?.length > 0 ? (
        <motion.div
          className="relative h-36 sm:h-40 md:h-48 mb-2 sm:mb-3 overflow-hidden rounded-lg bg-gray-100"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onImageClick?.(product.images, 0); }}
            loading="lazy"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.2 }}
          />
          {product.images.length > 1 && (
            <motion.div
              className="absolute bottom-2 right-2 flex space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {product.images.slice(1, 4).map((img, i) => (
                <motion.div
                  key={img}
                  className="w-8 h-8 rounded-md overflow-hidden border border-white cursor-pointer hover:opacity-80"
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageClick?.(product.images, i + 1);
                  }}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </motion.div>
              ))}
              {product.images.length > 4 && (
                <motion.div
                  className="w-8 h-8 rounded-md bg-black bg-opacity-60 flex items-center justify-center text-white text-xs border border-white"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  +{product.images.length - 4}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="h-36 sm:h-40 md:h-48 mb-2 sm:mb-3 bg-gray-100 rounded-lg flex items-center justify-center"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-gray-400">No image</span>
        </motion.div>
      )}

      <motion.div className="flex-grow" initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex justify-between items-start mb-1">
          <motion.h2
            className="font-semibold text-indigo-700 text-base sm:text-lg line-clamp-1"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {product.title}
          </motion.h2>
          <motion.span
            className="bg-indigo-100 dark:bg-gray-700 text-indigo-800 dark:text-indigo-200 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded capitalize"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {product.category || "Other"}
          </motion.span>
        </div>

        <motion.p
          className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {product.description}
        </motion.p>

        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <motion.p
              className="text-green-600 font-medium text-base sm:text-lg"
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              ₹{product.price}
              {product.negotiable && (
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 ml-1">(Negotiable)</span>
              )}
            </motion.p>
            <motion.p
              className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {new Date(product.createdAt).toLocaleDateString()}
            </motion.p>
          </div>

          <div className="flex justify-between items-center mt-1 sm:mt-2">
            <div className="flex items-center gap-2">
              <img
                src={
                  product.user?.profileImage ||
                  "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                alt={product.user?.name || "Seller"}
                className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              <div>
                <motion.div className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-200">
                  {product.user?.name || "Unknown Seller"}
                </motion.div>
                <motion.div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                  {product.user?.branch || "Branch not specified"}
                </motion.div>
              </div>
            </div>

            <motion.button
              className="text-indigo-600 text-[10px] sm:text-xs hover:underline font-medium"
              whileHover={{ scale: 1.05, color: "#4338ca" }}
              onClick={(e) => {
                e.stopPropagation();
                const whatsappNumber = product.user?.whatsapp;
                if (!whatsappNumber) {
                  alert("Seller has not provided WhatsApp contact information");
                  return;
                }
                const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
                const message = encodeURIComponent(
                  `Hi! I'm interested in your product: ${product.title}`
                );
                window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
              }}
            >
              Contact
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
