import { RegisterForm } from "@/components/auth/RegisterForm";
import {
  register,
  verifyOtp,
  resendOtp,
} from "../../services/auth/authServices";
import { getErrorMessage, getResponseData } from "../../utils/responseHelpers";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSendOtp = async (data) => {
    try {
      const result = await register(data);
      return getResponseData(result);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const handleVerifyOtp = async ({ email, otp }) => {
    try {
      const result = await verifyOtp({ email, otp });
      const resData = getResponseData(result);
      dispatch(setUser(resData));
      Cookies.set("accessToken", resData.accessToken, { expires: 7 });
      navigate("/", { replace: true });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const handleResendOtp = async (email) => {
    try {
      await resendOtp({ email });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  };

  const handleGoogleSignup = () => {
    navigate("/api/auth/google", { replace: true });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm
          onGoogleSignup={handleGoogleSignup}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          onResendOtp={handleResendOtp}
        />
      </div>
    </div>
  );
}
