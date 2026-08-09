import api from "../../configs/axios";
import endpoints from "../../constants/endpoints";

const login = (data) => {
  return api.post(endpoints.auth.LOGIN, data);
};

const getMe = () => {
  return api.get(endpoints.auth.GET_ME);
};

const register = (data) => {
  return api.post(endpoints.auth.REGISTER, data);
};

const verifyOtp = (data) => {
  return api.post(endpoints.auth.VERIFY_OTP, data);
};

const resendOtp = (data) => {
  return api.post(endpoints.auth.RESEND_OTP, data);
};

export { login, getMe, register, verifyOtp, resendOtp };
