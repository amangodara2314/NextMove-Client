import api from "../../configs/axios";
import endpoints from "../../constants/endpoints";

const getGame = (gameId, opt) => {
  return api.get(endpoints.game.GET_GAME(gameId), opt);
};

const getMoves = (gameId, cursor, signal) => {
  return api.get(endpoints.game.GET_MOVES(gameId, cursor), { signal });
};

const getTimeControlSettings = () => {
  return api.get(endpoints.game.GET_TIME_CONTROL_SETTINGS);
};

export { getGame, getMoves, getTimeControlSettings };
