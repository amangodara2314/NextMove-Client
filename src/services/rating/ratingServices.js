import api from "../../configs/axios";
import endpoints from "../../constants/endpoints";

const getUserRatings = async (userId) => {
  return await api.get(endpoints.RATING.GET_USER_RATINGS);
};

export { getUserRatings };
