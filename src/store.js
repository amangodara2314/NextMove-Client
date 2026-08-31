import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import ratingReducer from "./features/rating/ratingSlice";
import gamesReducer from "./features/games/gamesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    rating: ratingReducer,
    games: gamesReducer,
  },
});

export default store;
