import { useDispatch, useSelector } from "react-redux";
import { selectGames } from "../features/games/gamesSelector";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import { toast } from "sonner";
import { getRecentGames } from "../services/game/gameServices";
import {
  fetchRecentGamesFailure,
  fetchRecentGamesStart,
  fetchRecentGamesSuccess,
} from "../features/games/gamesSlice";
import { useEffect } from "react";

export default function useRecentGames() {
  const { recentGames, loadingRecentGames, errorLoadingRecentGames } =
    useSelector(selectGames);
  const dispatch = useDispatch();

  const fetchRecentGames = async () => {
    dispatch(fetchRecentGamesStart());
    try {
      const response = await getRecentGames();
      const data = getResponseData(response);
      dispatch(fetchRecentGamesSuccess(data));
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(fetchRecentGamesFailure(message));
      toast.error(message);
    }
  };

  useEffect(() => {
    if (recentGames && recentGames.length !== 0) return;
    fetchRecentGames();
  }, []);

  return {
    recentGames,
    loadingRecentGames,
    errorLoadingRecentGames,
    fetchRecentGames,
  };
}
