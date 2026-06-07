import api from "../../configs/axios";
import endpoints from "../../constants/endpoints";

const login = (data) => {
  return api.post(endpoints.auth.LOGIN, data);
};

export { login };
