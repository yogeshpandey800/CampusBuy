import React from "react";
import HomeHeader from "../Component/HomeHeader";
import ProductCard from "../Component/ProductCard";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { wishlistProducts, loadingWishlist } = useWishlist();

  return (
    <section className="bg-gradient-to-b from-[#fcfdfd] via-[#fffbee] to-[#f7f9ff] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen transition-colors duration-300">
      <HomeHeader />
      <div className="px-3 sm:px-4 py-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-4">My Wishlist</h1>
        {loadingWishlist ? (
          <p className="text-gray-500 dark:text-gray-300">Loading wishlist...</p>
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 text-gray-600 dark:text-gray-300 shadow-sm transition-colors duration-300">
            No items saved yet. Tap the heart icon on products to add them here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
