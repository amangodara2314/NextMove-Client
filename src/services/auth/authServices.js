import api from "../../configs/axios";
import endpoints from "../../constants/endpoints";

const login = (data) => {
  return api.post(endpoints.auth.LOGIN, data);
};

const getMe = () => {
  return api.get(endpoints.auth.GET_ME);
};

export { login, getMe };
