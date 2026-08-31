export const selectGames = (state) => state.games;

export const selectRecentGames = (state) => state.games.recentGames;

export const selectLoadingRecentGames = (state) =>
  state.games.loadingRecentGames;

export const selectErrorLoadingRecentGames = (state) =>
  state.games.errorLoadingRecentGames;
