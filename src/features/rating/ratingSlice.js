import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ratings: [],
  loadingRatings: false,
  ratingsError: null,
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    fetchRatingsStart(state) {
      state.loadingRatings = true;
      state.ratingsError = null;
    },

    fetchRatingsSuccess(state, action) {
      state.loadingRatings = false;
      if (!action.payload || !Array.isArray(action.payload)) {
        state.ratings = [];
        state.ratingsError = "Invalid ratings data received";
        return;
      }
      state.ratings = action.payload;
    },

    fetchRatingsFailure(state, action) {
      state.ratingsError = action.payload;
      state.loadingRatings = false;
    },
  },
});

export const { fetchRatingsStart, fetchRatingsSuccess, fetchRatingsFailure } =
  ratingSlice.actions;

export default ratingSlice.reducer;
