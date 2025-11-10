import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ keyword, page = 1, category }, { rejectWithValue }) => {
    try {
      let link = "/api/v1/products?page=" + page;
      if (category) {
        link += `&category=${category}`;
      }
      if (keyword) {
        link += `&keyword=${keyword}`;
      }
      // const link = keyword ? `/api/v1/products?keyword=${encodeURIComponent(keyword)}&page=${page}`:`/api/v1/products?page=${page}`
      // const link = "/api/v1/products"
      const response = await axios.get(link);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occured");
    }
  }
);

// product details
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const link = `/api/v1/product/${id}`;
      const response = await axios.get(link);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occured");
    }
  }
);

// product details
export const createReviews = createAsyncThunk(
  "product/createReviews",
  async ({ rating, comment, productId }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const link = `/api/v1/products/review`;
      const response = await axios.put(
        link,
        { rating, comment, productId },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occured");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productCount: 0,
    error: null,
    loading: false,
    product: [],
    resultsPerPage: 4,
    totalPages: 0,
    reviewSuccess: false,
    reviewLoading: false,
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeReviewSuccess: (state) => {
      state.reviewSuccess = null;
    },
  },
  extraReducers: (builder) => {
    // all products
    builder
      .addCase(getProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.error = null;
        state.loading = false;
        state.productCount = action.payload.productCount;
        state.resultsPerPage = action.payload.resultsPerPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.error = state.error = action.payload || "Something went wrong";
      });

    // product details
    builder
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
        state.loading = false;
      });

    //create review for the products
    builder
      .addCase(createReviews.pending, (state) => {
        state.reviewLoading = true;
        state.error = null;
      })
      .addCase(createReviews.fulfilled, (state, action) => {
        (state.reviewLoading = false),
         (state.error = null);
        state.reviewSuccess = true;
        state.product = action.payload.product;
      })
      .addCase(createReviews.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
        state.reviewLoading = false;
      });
  },
});

export const { removeError, removeReviewSuccess } = productSlice.actions;
export default productSlice.reducer;
