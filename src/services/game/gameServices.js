import api from "../../configs/axios";
import endpoints from "../../constants/endpoints";

const getGame = (gameId, opt) => {
  return api.get(endpoints.game.GET_GAME(gameId), opt);
};

const getMoves = (gameId, cursor, signal) => {
  return api.get(endpoints.game.GET_MOVES(gameId, cursor), { signal });
};

const checkPlayerTimeout = (gameId) => {
  return api.get(endpoints.game.CHECK_PLAYER_TIMEOUT(gameId));
};

const offerDraw = (gameId) => {
  return api.post(endpoints.game.OFFER_DRAW(gameId));
};

const acceptDraw = (gameId) => {
  return api.post(endpoints.game.ACCEPT_DRAW(gameId));
};

const getRecentGames = () => {
  return api.get(endpoints.game.RECENT_GAMES(10));
};

const getGames = (cursor, options) => {
  return api.get(endpoints.game.GET_GAMES(cursor), options);
};

const resignGame = (gameId) => {
  return api.post(endpoints.game.RESIGN(gameId));
};

export {
  getGame,
  getMoves,
  checkPlayerTimeout,
  offerDraw,
  acceptDraw,
  getRecentGames,
  getGames,
  resignGame,
};
