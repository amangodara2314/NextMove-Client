import { LoginForm } from "@/components/auth/LoginForm";
import { login } from "../../services/auth/authServices";
import { getErrorMessage, getResponseData } from "../../utils/responseHelpers";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitHandler = async (data, setError) => {
    try {
      const result = await login(data);
      const resData = getResponseData(result);
      console.log(resData);
      dispatch(setUser(resData.user));
      Cookies.set("accessToken", resData.accessToken, { expires: 7 });
      navigate("/", { replace: true });
      return;
    } catch (error) {
      const message = getErrorMessage(error);
      setError("root", {
        message,
      });
    }
  };
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm submitHandler={submitHandler} />
      </div>
    </div>
  );
}
