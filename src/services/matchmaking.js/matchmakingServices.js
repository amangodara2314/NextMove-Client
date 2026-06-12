import api from "../../configs/axios";
import endpoints from "../../constants/endpoints";

const newGame = () => {
  return api.post(endpoints.matchmaking.NEW_GAME);
};

export { newGame };
