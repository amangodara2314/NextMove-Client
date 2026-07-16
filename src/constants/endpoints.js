const endpoints = {
  auth: {
    LOGIN: "/auth/login",
    GET_ME: "/auth/me",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  matchmaking: {
    NEW_GAME: "/matchmaking/new-game",
  },
  game: {
    GET_GAME: (gameId) => `/game/${gameId}`,
    GET_MOVES: (gameId, cursor) =>
      `/game/moves/${gameId}${cursor ? "?cursor=" + cursor : ""}`,
    GET_TIME_CONTROL_SETTINGS: `/game/settings`,
  },
};

export default endpoints;
