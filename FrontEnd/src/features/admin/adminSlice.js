import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// getting all products by admin
export const getAllProductsByAdmin = createAsyncThunk("admin/getAllProductsByAdmin",async(_,{rejectWithValue})=>{
  try{
    const {data} = await axios.get("/api/v1/admin/products")
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Error in Fetching products data")
  }
})

// Create product by admin
export const createProduct = createAsyncThunk("admin/createProduct",async(productData,{rejectWithValue})=>{
  try{
    const config = {
      headers:{
        'Content-Type':"multipart/form-data"
      }
    }
    const {data} = await axios.post("/api/v1/admin/products/create",productData,config);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Product creation failed")
  }
})

// update product
export const updateProduct = createAsyncThunk("admin/updateProduct",async({id,productData},{rejectWithValue})=>{
  try{
    const config = {
      headers:{
        'Content-Type':"multipart/form-data"
      }
    }
    const {data} = await axios.put(`/api/v1/admin/product/update/${id}`,productData,config);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Product update failed")
  }
})


// delete product
export const deleteProduct = createAsyncThunk("admin/deleteProduct",async(id,{rejectWithValue})=>{
  try{
    const {data} = await axios.delete(`/api/v1/admin/product/delete/${id}`);
    return {id}
  }catch(error){
    return rejectWithValue(error.response?.data || "Product deletion failed")
  }
})

// Fetch users
export const fetchAllUsers = createAsyncThunk("admin/fetchAllUsers",async(_,{rejectWithValue})=>{
  try{
    const {data} = await axios.get(`/api/v1/admin/users`);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Fetching All Users Failed")
  }
})


// fetching single user details by admin
export const getSingleUserDetail = createAsyncThunk("admin/getSingleUserDetail",async(id,{rejectWithValue})=>{
  try{
    const {data} = await axios.get(`/api/v1/admin/user/${id}`);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Fetching single User Failed")
  }
})

// update user by admin
export const updateUserRoleByAdmin = createAsyncThunk("admin/updateUserRoleByAdmin",async({id,role},{rejectWithValue})=>{
  try{
    const config = {
      headers:{
        'Content-Type' : "application/json"
      }
    }
    const {data} = await axios.put(`/api/v1/admin/user/${id}`,{role},config);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Failed to update user Role")
  }
})

// delete user by admin
export const deleteUserByAdmin = createAsyncThunk("admin/deleteUserByAdmin",async(id,{rejectWithValue})=>{
  try{
    const {data} = await axios.delete(`/api/v1/admin/user/${id}`);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Failed to delete user.")
  }
})


// Fetching all orders 
export const getAllOrders = createAsyncThunk("admin/getAllOrders",async(_,{rejectWithValue})=>{
  try{
    const {data} = await axios.get(`/api/v1/admin/orders`);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Failed to fetch orders")
  }
})


// delete order
export const deleteOrder = createAsyncThunk("admin/deleteOrder",async(id,{rejectWithValue})=>{
  try{
    const {data} = await axios.delete(`/api/v1/admin/order/${id}`);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Failed to delete order")
  }
})


// update order status
export const updateOrderStatus = createAsyncThunk("admin/updateOrderStatus",async({id,status},{rejectWithValue})=>{
  try{
    const config = {
      headers:{
        'Content-Type':"application/json"
      }
    }
    const {data} = await axios.put(`/api/v1/admin/order/${id}`,{status},config);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Failed to update order")
  }
})


// Fetch product reviews
export const fetchProductReviews = createAsyncThunk("admin/fetchProductReviews",async(id,{rejectWithValue})=>{
  try{
   
    const {data} = await axios.get(`/api/v1/admin/reviews?id=${id}`);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Failed to fetch product reviews" )
  }
})


// delete product reviews
export const deleteProductReview = createAsyncThunk("admin/deleteProductReview",async({productId,reviewId},{rejectWithValue})=>{
  try{
   
    const {data} = await axios.delete(`/api/v1/admin/reviews?productId=${productId}&id=${reviewId}`);
    return data
  }catch(error){
    return rejectWithValue(error.response?.data || "Failed to delete product reviews" )
  }
})



const adminSlice = createSlice({
  name:"admin",
  initialState:{
    products:[],
    success:false,
    loading:false,
    error:null,
    product:{},
    deleting:{},
    users:[],
    user:{},
    message:null,
    orders:[],
    totalAmount:null,
    order:{},
    reviews:[]
  },
 reducers:{
   removeError: (state) => {
      state.error = null;
    },
   removeSuccess: (state) => {
      state.success = null;
    },
    clearMessage:(state)=>{
      state.message = null;
    }
 },
 extraReducers:(builder)=>{

  // getting all products by admin
  builder.addCase(getAllProductsByAdmin.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(getAllProductsByAdmin.fulfilled,(state,action)=>{
    state.loading = false,
    state.products = action.payload?.products
  }).addCase(getAllProductsByAdmin.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message || "Error in Fetching products data";
  })

  //  Create products by admin
   builder.addCase(createProduct.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(createProduct.fulfilled,(state,action)=>{
    state.loading = false,
    state.success = action.payload.success,
    state.products.push(action.payload.product)
  }).addCase(createProduct.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message || "Product creation failed";
  })

  // update product
builder.addCase(updateProduct.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(updateProduct.fulfilled,(state,action)=>{
    state.loading = false,
    state.success = action.payload.success,
    state.product = (action.payload.product)
  }).addCase(updateProduct.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message || "Product update failed";
  })


  // delete product
builder.addCase(deleteProduct.pending,(state,action)=>{
    const productId = action.meta.arg;
    state.deleting[productId] = true,
    state.error = null
  }).addCase(deleteProduct.fulfilled,(state,action)=>{
    const productId = action.payload.id;
    state.deleting[productId] = false;
    state.products = state.products.filter(product=>product.id!==action.payload.id)
  }).addCase(deleteProduct.rejected,(state,action)=>{
     const productId = action.meta.arg;
    state.deleting[productId] = false,
    state.error =  action.payload?.message || "Product deletion failed";
  })

  // Fetching all Users by admin
  builder.addCase(fetchAllUsers.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(fetchAllUsers.fulfilled,(state,action)=>{
    state.loading = false,
    state.users = action.payload?.users
  }).addCase(fetchAllUsers.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message || "Error in Fetching users data";
  })



  // fetching single user by admin
builder.addCase(getSingleUserDetail.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(getSingleUserDetail.fulfilled,(state,action)=>{
    state.loading = false,
    state.user = (action.payload.user)
  }).addCase(getSingleUserDetail.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message ||"Error in Fetching single user data";
  })

  // update user role by admin
builder.addCase(updateUserRoleByAdmin.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(updateUserRoleByAdmin.fulfilled,(state,action)=>{
    state.loading = false,
    state.success = action.payload.success
  }).addCase(updateUserRoleByAdmin.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message ||"Failed to update user Role";
  })

  // delete user role by admin
builder.addCase(deleteUserByAdmin.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(deleteUserByAdmin.fulfilled,(state,action)=>{
    state.loading = false,
   state.message = action.payload.message
  }).addCase(deleteUserByAdmin.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message ||"Failed to delete user";
  })


  //fetch all orders by admin
builder.addCase(getAllOrders.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(getAllOrders.fulfilled,(state,action)=>{
    state.loading = false,
    state.orders = action.payload.orders
    state.totalAmount = action.payload.totalAmount
  }).addCase(getAllOrders.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message ||"Failed to fetch all orders ";
  })

  //delete order
builder.addCase(deleteOrder.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(deleteOrder.fulfilled,(state,action)=>{
    state.loading = false,
    state.success = action.payload.success,
    state.message = action.payload.message
  }).addCase(deleteOrder.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message ||"Failed to delete order ";
  })

  // update order status
  builder.addCase(updateOrderStatus.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(updateOrderStatus.fulfilled,(state,action)=>{
    state.loading = false,
    state.success = action.payload.success
    state.order = action.payload.order
  }).addCase(updateOrderStatus.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message ||"Failed to delete order ";
  })


  // fetch product reviews
  builder.addCase(fetchProductReviews.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(fetchProductReviews.fulfilled,(state,action)=>{
    state.loading = false,
    state.reviews = action.payload.reviews
  }).addCase(fetchProductReviews.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message ||"Failed to fetch product reviews ";
  })

  // fetch product reviews
  builder.addCase(deleteProductReview.pending,(state)=>{
    state.loading = true,
    state.error = null
  }).addCase(deleteProductReview.fulfilled,(state,action)=>{
    state.loading = false,
    state.success = action.payload.success,
    state.message = action.payload.message
  }).addCase(deleteProductReview.rejected,(state,action)=>{
    state.loading = false,
    state.error =  action.payload?.message ||"Failed to delete product  reviews ";
  })


  
 }

})

export const {removeError,removeSuccess,clearMessage} = adminSlice.actions;
export default adminSlice.reducer;