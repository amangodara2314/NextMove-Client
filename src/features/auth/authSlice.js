import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload.user || null;
      state.isAuthenticated = true;
      state.accessToken = payload?.accessToken || null;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
