import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const initialState = {
  user: null,
  token: Cookies.get("token") || null,
  email_send: false,
  loading: false,
  error: null,
};

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
  },
});

// Selectors (optional)
export const { logout, setUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;
