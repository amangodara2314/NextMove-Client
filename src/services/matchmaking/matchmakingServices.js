import api from "../../configs/axios";
import endpoints from "../../constants/endpoints";

const newGame = (data) => {
  return api.post(endpoints.matchmaking.NEW_GAME, data);
};

const getTimeControlSettings = () => {
  return api.get(endpoints.matchmaking.GET_TIME_CONTROL_SETTINGS);
};

export { newGame, getTimeControlSettings };
