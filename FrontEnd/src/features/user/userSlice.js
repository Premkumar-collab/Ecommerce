import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/v1/register", userData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occured");
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/login",
        { email, password },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occured");
    }
  }
);

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/profile");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occured");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/v1/logout");
      console.log("logout user");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "An error occured");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.put(
        "/api/v1/profile/update",
        userData,
        config
      );
      console.log("user profile updated");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "User profile update failed" }
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/v1/password/update",
        userData,
        config
      );
      console.log("user password updated");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "User password update failed" }
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/v1/password/forget",
        email,
        config
      );
      console.log("user password forgotten request sent");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "User password update request failed",
        }
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, userData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `/api/v1/reset/${token}`,
        userData,
        config
      );
      console.log("user password forgotten modified successful.");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "User password update  failed" }
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    message: null,
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
    // Register User
    builder
      .addCase(register.pending, (state) => {
        (state.loading = true), (state.error = null), (state.success = false);
      })
      .addCase(register.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = null),
          (state.success = action.payload.success),
          (state.user = action.payload?.user || null);
        state.isAuthenticated = Boolean(action.payload?.user);

        // store in local storage
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem(
          "isAuthenticated",
          JSON.stringify(state.isAuthenticated)
        );
      })
      .addCase(register.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.error ||
            "Registration failed. Please try again later"),
          (state.user = null);
        state.isAuthenticated = false;
      });

    // Login user
    builder
      .addCase(login.pending, (state) => {
        (state.loading = true), (state.error = null), (state.success = false);
      })
      .addCase(login.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = null),
          (state.success = action.payload.success),
          (state.user = action.payload?.user || null);
        state.isAuthenticated = Boolean(action.payload?.user);
        // store in local storage
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem(
          "isAuthenticated",
          JSON.stringify(state.isAuthenticated)
        );
      })
      .addCase(login.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.error || "Login failed. Please try again later"),
          (state.user = null);
        state.isAuthenticated = false;
      });

    // load user details
    builder
      .addCase(loadUser.pending, (state) => {
        (state.loading = true), (state.error = null), (state.success = false);
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = null),
          (state.user = action.payload?.user || null);
        state.isAuthenticated = Boolean(action.payload?.user);

         // store in local storage
        localStorage.setItem("user",JSON.stringify(state.user))
        localStorage.setItem("isAuthenticated",JSON.stringify(state.isAuthenticated))
      })
      .addCase(loadUser.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.error ||
            "User loading failed. Please try again later"),
          (state.user = null);
        state.isAuthenticated = false;

        if(action.payload?.statusCode === 401){
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem("user")
          localStorage.removeItem("isAuthenticated")
        }
      });

    // logout user profile
    builder
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
        state.success = null;
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        (state.error = null),
          (state.user = null),
          (state.loading = false),
          (state.isAuthenticated = false)
           localStorage.removeItem("user")
          localStorage.removeItem("isAuthenticated")
      })
      .addCase(logoutUser.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message || "Failed to logout user profile");
      });

    // update user profile
    builder
      .addCase(updateProfile.pending, (state) => {
        (state.loading = true), (state.error = null), (state.success = false);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = null),
          (state.success = action.payload.success),
          (state.user = action.payload?.user || null);
        state.message = action.payload?.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.error ||
            "User update failed. Please try again later"),
          (state.user = null);
      });

    // update password
    builder
      .addCase(updatePassword.pending, (state) => {
        (state.loading = true), (state.error = null), (state.success = false);
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = null),
          (state.success = action.payload.success);
        state.message = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload.error?.message ||
            "User password update failed. Please try again later");
      });

    // request for forgotten password change
    builder
      .addCase(forgotPassword.pending, (state) => {
        (state.loading = true), (state.error = null), (state.success = false);
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = null),
          (state.success = action.payload?.success);
        state.message = action.payload?.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message ||
            "Email sent failed. Please try again later");
      });

    // Forgotten passwor modification
    builder
      .addCase(resetPassword.pending, (state) => {
        (state.loading = true), (state.error = null), (state.success = false);
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = null),
          (state.success = action.payload?.success);
        state.isAuthenticated = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        (state.loading = false),
          (state.error =
            action.payload?.message ||
            "User password modification  failed. Please try again later");
      });
  },
});

export const { removeError, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
