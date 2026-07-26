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

export { getGame, getMoves, checkPlayerTimeout };
