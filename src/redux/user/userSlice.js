import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: typeof window !== "undefined" && localStorage.getItem("user")
    ? (() => {
        const savedUser = localStorage.getItem("user");
        try {
          return savedUser ? JSON.parse(savedUser) : null;
        } catch {
          return null;
        }
      })()
    : null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 🔹 Login reducers
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      localStorage.removeItem("user");
    },

    // 🔹 Logout reducers (your existing ones)
    logoutStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.loading = false;
      localStorage.removeItem("user");
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
} = userSlice.actions;

export default userSlice.reducer;

