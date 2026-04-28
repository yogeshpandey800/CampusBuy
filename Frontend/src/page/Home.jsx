import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import {
  setProducts,
  setLoading,
  setError,
  setCurrentPage,
  addProduct,
  updateProduct,
  removeProduct,
} from "../utils/appSlice";
import HomeHeader from "../Component/HomeHeader";
import ProductCard from "../Component/ProductCard";
import { useWishlist } from "../context/WishlistContext";

// Initialize socket connection
const socket = io("http://localhost:5000");

function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((store) => store.app);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentProductImages, setCurrentProductImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter states
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceSort, setPriceSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showWishlistedOnly, setShowWishlistedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { wishlistIds } = useWishlist();

  const categories = [
    "All",
    "Electronics",
    "Furniture",
    "Books",
    "Fashion",
    "Vehicles",
  ];

  

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter products based on selected criteria
  const applyFilters = () => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price sorting
    if (priceSort === "low-to-high") {
      filtered = filtered.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      );
    } else if (priceSort === "high-to-low") {
      filtered = filtered.sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      );
    }

    if (showWishlistedOnly) {
      filtered = filtered.filter((product) => wishlistIds.has(product._id));
    }

    if (debouncedSearchQuery) {
      filtered = filtered.filter((product) =>
        product.title?.toLowerCase().includes(debouncedSearchQuery)
      );
    }

    setFilteredProducts(filtered);
  };

  // Apply filters when products or filters change
  useEffect(() => {
    applyFilters();
  }, [products, selectedCategory, priceSort, showWishlistedOnly, wishlistIds, debouncedSearchQuery]);

  // Handle filter changes
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceSort = (sortOrder) => {
    setPriceSort(sortOrder);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceSort("");
    setShowWishlistedOnly(false);
    setSearchQuery("");
  };

  // Handle keyboard navigation for image preview
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();

        const totalImages = currentProductImages.length;
        if (totalImages <= 1) return;

        let newIndex = currentImageIndex;
        if (e.key === "ArrowRight") {
          newIndex = (currentImageIndex + 1) % totalImages;
        } else if (e.key === "ArrowLeft") {
          newIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        }

        setCurrentImageIndex(newIndex);
        setSelectedImage(currentProductImages[newIndex]);
      } else if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentProductImages, currentImageIndex]);

  useEffect(() => {
    dispatch(setCurrentPage("home"));
    dispatch(setLoading(true));

    // Fetch initial products
    fetch("http://localhost:5000/api/product/all", {
      signal: AbortSignal.timeout(5000),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        dispatch(setProducts(data));
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        dispatch(setError("Failed to fetch products"));
      })
      .finally(() => dispatch(setLoading(false)));

    // Listen for real-time product updates
    socket.on("new_product", (product) => {
      dispatch(addProduct(product));
    });

    socket.on("update_product", (product) => {
      dispatch(updateProduct(product));
    });

    socket.on("delete_product", (productId) => {
      dispatch(removeProduct(productId));
    });

    return () => {
      socket.off("new_product");
      socket.off("update_product");
      socket.off("delete_product");
    };
  }, [dispatch]);

  return (
    <>
    <section className="bg-gradient-to-b from-[#fcfdfd] via-[#fffbee] to-[#f7f9ff] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 h-full transition-colors duration-300">
      <HomeHeader />
      {/* Fullscreen Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.stopPropagation();
                e.preventDefault();

                const totalImages = currentProductImages.length;
                if (totalImages <= 1) return;

                let newIndex = currentImageIndex;
                if (e.key === "ArrowRight") {
                  newIndex = (currentImageIndex + 1) % totalImages;
                } else if (e.key === "ArrowLeft") {
                  newIndex =
                    (currentImageIndex - 1 + totalImages) % totalImages;
                }

                setCurrentImageIndex(newIndex);
                setSelectedImage(currentProductImages[newIndex]);
              } else if (e.key === "Escape") {
                setSelectedImage(null);
              }
            }}
            tabIndex={0}
          >
            {/* Left Arrow Navigation */}
            {currentProductImages.length > 1 && (
              <button
                className="absolute left-4 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 text-black text-2xl z-10 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  const totalImages = currentProductImages.length;
                  const newIndex =
                    (currentImageIndex - 1 + totalImages) % totalImages;
                  setCurrentImageIndex(newIndex);
                  setSelectedImage(currentProductImages[newIndex]);
                }}
              >
                ←
              </button>
            )}

            <motion.img
              src={selectedImage}
              alt="preview"
              className="max-w-[90vw] max-h-[90vh] rounded-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Right Arrow Navigation */}
            {currentProductImages.length > 1 && (
              <button
                className="absolute right-4 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 text-black text-2xl z-10 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  const totalImages = currentProductImages.length;
                  const newIndex = (currentImageIndex + 1) % totalImages;
                  setCurrentImageIndex(newIndex);
                  setSelectedImage(currentProductImages[newIndex]);
                }}
              >
                →
              </button>
            )}

            {/* Image Counter */}
            {currentProductImages.length > 1 && (
              <div className="absolute bottom-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
                {currentImageIndex + 1} / {currentProductImages.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product List */}
      <motion.div
        className="min-h-screen px-3 sm:px-4 py-4 pb-20 sm:pb-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        
        {/* main header is here */}
        <motion.div
          className="flex items-center justify-center gap-1 sm:gap-3"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{
            scale: [0.95, 1.02, 1],
            opacity: 1,
            y: [0, -4, 0],
          }}
          transition={{
            scale: { duration: 0.4 },
            y: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
            opacity: { duration: 0.4 },
          }}
        >

          <motion.h1
            className="font-bold text-2xl text-blue-900 tracking-wide p-6"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            🛍️ MMMUT Buy & Sell
          </motion.h1>
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          className="max-w-6xl mx-auto mb-4 sm:mb-6 px-4 sm:px-6 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm transition-all duration-200"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col gap-4">
            {/* TOP: Category Filter */}
            <div className="w-full">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400 mr-1">
                  Category
                </span>
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium border transition-all duration-200 ${
                    selectedCategory === category ||
                    (category === "All" && !selectedCategory)
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
              </div>
            </div>

            {/* BOTTOM: Search + Right Controls */}
            <div className="w-full flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
              <div className="relative w-full lg:flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-11 pl-11 pr-4 rounded-full text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
              </div>
              <div className="w-full lg:w-auto flex flex-wrap items-center gap-2.5 lg:justify-end">
                <select
                  value={priceSort}
                  onChange={(e) => handlePriceSort(e.target.value)}
                  className="h-11 min-w-[170px] rounded-full px-4 text-sm border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <option value="">Default</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>

              <motion.button
                onClick={() => setShowWishlistedOnly((prev) => !prev)}
                className={`h-11 rounded-full px-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  showWishlistedOnly
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                {showWishlistedOnly ? "Wishlisted only" : "Show only wishlisted"}
              </motion.button>

              {/* Clear Filters */}
              {(selectedCategory || priceSort || showWishlistedOnly || searchQuery) && (
                <motion.button
                  onClick={clearFilters}
                  className="h-11 rounded-full px-4 text-sm bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear
                </motion.button>
              )}
            </div>
          </div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="flex justify-center items-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <span className="block sm:inline">
                {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product._id || index}
              product={product}
              onImageClick={(images, imageIndex) => {
                setCurrentProductImages(images);
                setCurrentImageIndex(imageIndex);
                setSelectedImage(images[imageIndex]);
              }}
            />
          ))}
        </motion.div>

        {/* Empty State */}
        {!loading && products.length > 0 && filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-500 dark:text-gray-300 text-lg">
                No products found 😢
              </p>
            </motion.div>
          )}

        {!loading && products.length === 0 && (
            <motion.div
              className="text-center py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-500 dark:text-gray-300">
                No products available at the moment.
              </p>
            </motion.div>
          )}
      </motion.div>
    </section>
    </>
  );
}

export default Home;
