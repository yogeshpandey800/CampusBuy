import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, getAuthToken } from "./authUtils";

const getAxiosConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats`, getAxiosConfig());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, getAxiosConfig());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/products`, getAxiosConfig());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, getAxiosConfig());
      return userId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/products/${productId}`, getAxiosConfig());
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: {
      totalUsers: 0,
      totalProducts: 0,
    },
    users: [],
    products: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.stats.totalUsers = Math.max(0, state.stats.totalUsers - 1);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product._id !== action.payload);
        state.stats.totalProducts = Math.max(0, state.stats.totalProducts - 1);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
