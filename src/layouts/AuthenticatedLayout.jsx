import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../features/auth/authSelectors";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import { setUser } from "../features/auth/authSlice";
import { Spinner } from "@/components/ui/spinner";
import { getMe } from "../services/auth/authServices";
import Loader from "../components/Loader";

// This layout component does the following things :-
// 1. Check if the user is authenticated or not
// 2. if yes then render child components
// 3. if not then check if there is a token in cookies
// 4. if yes then make a request to authenticate user token
// 5. if no or the request fails then redirect user to login page

export default function AuthenticatedLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !accessToken) {
      navigate("/login");
      return;
    }

    const verifyUser = async () => {
      try {
        const res = await getMe();
        const data = getResponseData(res);
        dispatch(setUser(data));
      } catch (error) {
        const message = getErrorMessage(error);
        console.error(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="h-dvh">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
