import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import ratingReducer from "./features/rating/ratingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    rating: ratingReducer,
  },
});

export default store;
