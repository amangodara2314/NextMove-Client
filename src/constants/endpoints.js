const endpoints = {
  auth: {
    LOGIN: "/auth/login",
    GET_ME: "/auth/me",
    REFRESH_TOKEN: "/auth/refresh-token",
    REGISTER: "/auth/register",
    RESEND_OTP: "/auth/resend-otp",
    VERIFY_OTP: "/auth/verify-otp",
    GOOGLE_LOGIN: "/auth/google/login",
    GOOGLE_REGISTER: "/auth/google/register",
  },
  matchmaking: {
    NEW_GAME: "/matchmaking/new-game",
    GET_TIME_CONTROL_SETTINGS: `/matchmaking/settings`,
  },
  game: {
    GET_GAME: (gameId) => `/game/${gameId}`,
    GET_MOVES: (gameId, cursor) =>
      `/game/moves/${gameId}${cursor ? "?cursor=" + cursor : ""}`,
    CHECK_PLAYER_TIMEOUT: (gameId) => `/game/check-timeout/${gameId}`,
    OFFER_DRAW: (gameId) => `/game/offer-draw/${gameId}`,
    ACCEPT_DRAW: (gameId) => `/game/accept-draw/${gameId}`,
  },
};

export default endpoints;
