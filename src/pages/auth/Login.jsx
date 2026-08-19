import { LoginForm } from "@/components/auth/LoginForm";
import { googleAuth, login } from "../../services/auth/authServices";
import { getErrorMessage, getResponseData } from "../../utils/responseHelpers";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const submitHandler = async (data, setError) => {
  //   try {
  //     const result = await login(data);
  //     const resData = getResponseData(result);
  //     console.log(resData);
  //     dispatch(setUser(resData));
  //     Cookies.set("accessToken", resData.accessToken, { expires: 7 });
  //     navigate("/", { replace: true });
  //   } catch (error) {
  //     const message = getErrorMessage(error);
  //     setError("root", {
  //       message,
  //     });
  //   }
  // };

  const handleGoogleSignupSuccess = async (codeResponse) => {
    try {
      const response = await googleAuth({ code: codeResponse.code });
      const resData = getResponseData(response);
      console.log(resData);
      dispatch(setUser(resData));
      Cookies.set("accessToken", resData.accessToken, { expires: 7 });
      navigate("/", { replace: true });
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  const handleGoogleSignupError = (error) => {
    toast.error("Something went wrong. Please try again later.");
  };
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          handleGoogleSignupError={handleGoogleSignupError}
          handleGoogleSignupSuccess={handleGoogleSignupSuccess}
        />
      </div>
    </div>
  );
}
