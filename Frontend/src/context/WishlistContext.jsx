import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../utils/appSlice";
import { API_BASE_URL, getAuthToken, useAuth } from "../utils/authUtils";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const userId = user?._id || user?.id;

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      setWishlistIds(new Set());
      setWishlistProducts([]);
      return;
    }

    const token = getAuthToken();
    if (!token) return;

    try {
      setLoadingWishlist(true);
      const response = await fetch(`${API_BASE_URL}/wishlist/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const data = await response.json();
      setWishlistIds(new Set(data.productIds || []));
      setWishlistProducts((data.items || []).map((item) => item.productId).filter(Boolean));
    } catch (error) {
      dispatch(
        addNotification({
          id: Date.now(),
          type: "error",
          message: "Could not load wishlist",
        })
      );
    } finally {
      setLoadingWishlist(false);
    }
  }, [dispatch, isAuthenticated, userId]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = useCallback(
    (productId) => {
      if (!productId) return false;
      return wishlistIds.has(productId);
    },
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!isAuthenticated || !userId) {
        dispatch(
          addNotification({
            id: Date.now(),
            type: "error",
            message: "Please login to use wishlist",
          })
        );
        return false;
      }

      const token = getAuthToken();
      if (!token) return false;

      const exists = wishlistIds.has(productId);
      const endpoint = exists
        ? `${API_BASE_URL}/wishlist/remove/${productId}`
        : `${API_BASE_URL}/wishlist/add`;
      const method = exists ? "DELETE" : "POST";

      const requestConfig = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (!exists) {
        requestConfig.body = JSON.stringify({ productId });
      }

      const previous = new Set(wishlistIds);
      const optimistic = new Set(wishlistIds);
      if (exists) {
        optimistic.delete(productId);
      } else {
        optimistic.add(productId);
      }
      setWishlistIds(optimistic);

      try {
        const response = await fetch(endpoint, requestConfig);
        if (!response.ok) {
          throw new Error("Wishlist update failed");
        }

        dispatch(
          addNotification({
            id: Date.now(),
            type: "success",
            message: exists ? "Removed from Wishlist" : "Added to Wishlist",
          })
        );
        fetchWishlist();
        return !exists;
      } catch (error) {
        setWishlistIds(previous);
        dispatch(
          addNotification({
            id: Date.now(),
            type: "error",
            message: "Failed to update wishlist",
          })
        );
        return exists;
      }
    },
    [dispatch, isAuthenticated, userId, wishlistIds, fetchWishlist]
  );

  const value = useMemo(
    () => ({
      wishlistIds,
      wishlistProducts,
      loadingWishlist,
      isWishlisted,
      toggleWishlist,
      refreshWishlist: fetchWishlist,
    }),
    [wishlistIds, wishlistProducts, loadingWishlist, isWishlisted, toggleWishlist, fetchWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
