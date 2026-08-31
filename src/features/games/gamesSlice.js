import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recentGames: [],
  loadingRecentGames: false,
  errorLoadingRecentGames: null,
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    fetchRecentGamesStart(state) {
      state.loadingRecentGames = true;
    },

    fetchRecentGamesSuccess(state, action) {
      state.recentGames = action.payload;
      state.loadingRecentGames = false;
    },

    fetchRecentGamesFailure(state, action) {
      state.errorLoadingRecentGames = action.payload;
      state.loadingRecentGames = false;
    },
  },
});

export const {
  fetchRecentGamesFailure,
  fetchRecentGamesStart,
  fetchRecentGamesSuccess,
} = gamesSlice.actions;

export default gamesSlice.reducer;
