import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  games: [],
  loadingGames: false,
  errorLoadingGames: null,
  hasMoreGames: true,
  cursor: null,

  recentGames: [],
  loadingRecentGames: false,
  errorLoadingRecentGames: null,
  shouldFetchRecentGames: true,
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    fetchRecentGamesStart(state) {
      state.loadingRecentGames = true;
      state.shouldFetchRecentGames = false;
    },

    fetchRecentGamesSuccess(state, action) {
      state.recentGames = action.payload;
      state.loadingRecentGames = false;
      state.shouldFetchRecentGames = false;
    },

    fetchRecentGamesFailure(state, action) {
      state.errorLoadingRecentGames = action.payload;
      state.loadingRecentGames = false;
    },

    setShouldFetchRecentGames(state, action) {
      state.shouldFetchRecentGames = action.payload;
    },

    fetchGamesStart(state) {
      state.loadingGames = true;
    },

    fetchGamesSuccess(state, action) {
      state.games = action.payload.games;
      state.cursor = action.payload.nextCursor;
      state.hasMoreGames = action.payload.hasMore;
      state.loadingGames = false;
    },

    fetchGamesFailure(state, action) {
      state.errorLoadingGames = action.payload;
      state.loadingGames = false;
    },
  },
});

export const {
  fetchRecentGamesFailure,
  fetchRecentGamesStart,
  fetchRecentGamesSuccess,
  setShouldFetchRecentGames,
  fetchGamesStart,
  fetchGamesSuccess,
  fetchGamesFailure,
} = gamesSlice.actions;

export default gamesSlice.reducer;
