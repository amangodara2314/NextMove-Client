const endpoints = {
  auth: {
    LOGIN: "/auth/login",
    GET_ME: "/auth/me",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  matchmaking: {
    NEW_GAME: "/matchmaking/new-game",
    GET_TIME_CONTROL_SETTINGS: `/matchmaking/settings`,
  },
  game: {
    GET_GAME: (gameId) => `/game/${gameId}`,
    GET_MOVES: (gameId, cursor) =>
      `/game/moves/${gameId}${cursor ? "?cursor=" + cursor : ""}`,
  },
};

export default endpoints;
