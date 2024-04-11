import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchCartItems } from "./cartSlice";
const apiUrl = process.env.REACT_APP_API_URL;

const initialState = {
  user: null,
  token: Cookies.get("token") || null,
  email_send: false,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${apiUrl}/users/auth/registration/`,
        userData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(
        `${apiUrl}/users/auth/login/`,
        credentials
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (refreshToken, thunkAPI) => {
    try {
      const response = await axios.post("/api/refresh", { refreshToken });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async (accessToken, thunkAPI) => {
    try {
      const response = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (verificationToken, thunkAPI) => {
    try {
      const response = await axios.post(
        `${apiUrl}/users/auth/registration/verify-email/`,
        {
          key: verificationToken,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (resetPasswordData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${apiUrl}/users/auth/password/reset/`,
        resetPasswordData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, thunkAPI) => {
    console.log(data, "data");
    const { token, credentials } = data;
    console.log(token, credentials, "data");
    try {
      const response = await axios.post(
        `${apiUrl}/users/auth/password/change/`,
        credentials,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const resetPasswordConfirm = createAsyncThunk(
  "auth/resetPasswordConfirm",
  async (resetPasswordData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${apiUrl}/users/auth/password/reset/confirm/`,
        resetPasswordData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const validateToken = createAsyncThunk(
  "auth/validateToken",
  async (accessToken, thunkAPI) => {
    try {
      const response = await axios.get(`${apiUrl}/users/auth/user/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null; // Clear refresh token on logout
      Cookies.remove("token");
    },
    setUser(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      Cookies.set("token", action.payload.access_token, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.email_send = true;
        // Update state based on register response (e.g., user data)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        console.log(action);
        toast.error(action.payload);
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        toast.success("Successfully logged in!");
        Cookies.set("token", action.payload.access_token, 1);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
        state.error = action.payload;
      })

      // Refresh access token (automatic or manual)
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken; // Update access token
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
        state.error = action.payload;
      })

      // Get user data
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update user data
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
        state.error = action.payload;
      })

      // Verify email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.email_send = false;
        // Handle successful email verification (e.g., show success message)
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
        state.error = action.payload;
      })

      // Reset password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
        state.error = action.payload;
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Instructions sent to your email!");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload);
        state.error = action.payload;
      })

      // Get user data
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        Cookies.remove("token");
        state.loading = false;
        state.error = null;
        logout(state);
      });
    // Interceptor for automatic refresh on token expiry (optional)
    // if (process.env.NODE_ENV !== "test") {
    //   // Avoid interceptor in tests
    //   axios.interceptors.response.use(
    //     (response) => response,
    //     async (error) => {
    //       const originalRequest = error.config;
    //       if (error.response.status === 401 && !originalRequest._retry) {
    //         originalRequest._retry = true;
    //         try {
    //           const refreshData = await thunkAPI.dispatch(
    //             refreshAccessToken(state.refreshToken)
    //           );
    //           state.token = refreshData.accessToken; // Update token in state
    //           originalRequest.headers.Authorization = `Bearer ${state.token}`;
    //           return axios(originalRequest);
    //         } catch (err) {
    //           console.error("Refresh token failed:", err.message);
    //           // Handle failed refresh or logout user here
    //         }
    //       }
    //       return Promise.reject(error);
    //     }
    //   );
    // }
  },
});

// Selectors (optional)
export const { logout, setUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;
export const selectEmailVerification = (state) => state.auth.email_send;

export default authSlice.reducer;
