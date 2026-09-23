const endpoints = {
  auth: {
    LOGIN: "/auth/login",
    GET_ME: "/auth/me",
    REFRESH_TOKEN: "/auth/refresh-token",
    REGISTER: "/auth/register",
    RESEND_OTP: "/auth/resend-otp",
    VERIFY_OTP: "/auth/verify-otp",
    GOOGLE_AUTH: "/auth/google",
    PROFILE: "/auth/profile",
  },
  matchmaking: {
    NEW_GAME: "/matchmaking/new-game",
    GET_TIME_CONTROL_SETTINGS: `/matchmaking/settings`,
  },
  game: {
    GET_GAME: (gameId) => `/game/${gameId}`,
    GET_GAMES: (cursor) => `/game?${cursor ? "&cursor=" + cursor : ""}`,
    GET_MOVES: (gameId, cursor) =>
      `/game/moves/${gameId}${cursor ? "?cursor=" + cursor : ""}`,
    CHECK_PLAYER_TIMEOUT: (gameId) => `/game/check-timeout/${gameId}`,
    OFFER_DRAW: (gameId) => `/game/offer-draw/${gameId}`,
    ACCEPT_DRAW: (gameId) => `/game/accept-draw/${gameId}`,
    RECENT_GAMES: (take = 10) => `/game/recent?take=${take}`,
    RESIGN: (gameId) => `/game/resign/${gameId}`,
  },
  RATING: {
    GET_USER_RATINGS: `/rating/all`,
  },
};

export default endpoints;
