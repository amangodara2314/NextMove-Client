import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, { user }) => {
      state.user = user;
      state.isAuthenticated = true;
    },
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
