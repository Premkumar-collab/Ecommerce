import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// creating order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post("/api/v1/new/order", order, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data || "An error occured");
    }
  }
);

// get user orders
export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/user/orders");
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data ||  "Failed to fetch orders");
    }
  }
);


// get single order Details
export const getOrderDetailsByUser = createAsyncThunk(
  "order/getOrderDetailsByUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data ||  "Failed to order Details");
    }
  }
);


const orderSlice = createSlice({
  name: "order",
  initialState: {
    success: false,
    loading: false,
    error: null,
    orders: [],
    order: {},
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    // create orders
    builder
      .addCase(createOrder.pending, (state) => {
        (state.loading = true), (state.error = null), (state.success = false);
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = action.payload.success),
          (state.order = action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload.message || "order Creating Failed";
      });

      // get all user orders
      builder
      .addCase(getUserOrders.pending, (state) => {
        (state.loading = true), (state.error = null), (state.success = false);
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = action.payload.success),
          (state.orders = action.payload.orders);
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload.message || "Failed to fetch orders";
      });


      // get single order details by user
      builder
      .addCase(getOrderDetailsByUser.pending, (state) => {
        (state.loading = true), (state.error = null), (state.success = false);
      })
      .addCase(getOrderDetailsByUser.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = action.payload.success),
          (state.order = action.payload.order);
      })
      .addCase(getOrderDetailsByUser.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload.message || "Failed to order Details";
      });
  },
});

export const { removeError, removeSuccess } = orderSlice.actions;
export default orderSlice.reducer;
