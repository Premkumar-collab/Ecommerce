import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add items to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      return {
        productId: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.image[0].url,
        stock: data.product.stock,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occured");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    loading: false,
    error: null,
    success: false,
    message: null,
    removeId:null,
    ShippingInfo:JSON.parse(localStorage.getItem("shippingInfo")) || {}
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removemessage: (state) => {
      state.message = null;
    },
    removeFromCart:(state,action)=>{
      state.removeId = action.payload;
      state.cartItems = state.cartItems.filter((items)=>items.productId !== action.payload)
      localStorage.setItem("cartItems",JSON.stringify(state.cartItems))
      state.removeId = null;
    },
    saveShippingInfo:(state,action)=>{
      state.ShippingInfo = action.payload;
      localStorage.setItem("shippingInfo",JSON.stringify(state.ShippingInfo))
    },
    clearCart : (state)=>{
      state.cartItems = [],
      localStorage.removeItem("cartItems"),
      localStorage.removeItem("shippingInfo")
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.pending, (state) => {
        (state.loading = true), (state.error = null);
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const item = action.payload;

        const existingItem = state.cartItems.find(
          (i) => i.productId === item.productId
        );
        if (existingItem) {
          existingItem.quantity = item.quantity;
          state.message = `updated ${item.name} quanitity in the cart`;
        } else {
          state.cartItems.push(item);
          state.message = `${item.name} is added to cart successfully`;
        }
        (state.loading = false), (state.error = null), (state.success = true);
        localStorage.setItem("cartItems",JSON.stringify(state.cartItems))
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload?.message || "Error in adding to cart");
      });
  },
});

export const { removeError, removemessage ,removeFromCart,saveShippingInfo,clearCart} = cartSlice.actions;
export default cartSlice.reducer;
