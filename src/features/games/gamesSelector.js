export const selectGamesStore = (state) => state.games;

export const selectRecentGames = (state) => state.games.recentGames;

export const selectLoadingRecentGames = (state) =>
  state.games.loadingRecentGames;

export const selectErrorLoadingRecentGames = (state) =>
  state.games.errorLoadingRecentGames;

export const selectShouldFetchRecentGames = (state) =>
  state.games.shouldFetchRecentGames;

export const selectLoadingGames = (state) => state.games.loadingGames;

export const selectErrorLoadingGames = (state) => state.games.errorLoadingGames;

export const selectGames = (state) => state.games.games;

export const selectHasMoreGames = (state) => state.games.hasMoreGames;

export const selectCursor = (state) => state.games.cursor;
