import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGames } from "../services/game/gameServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import {
  fetchGamesFailure,
  fetchGamesStart,
  fetchGamesSuccess,
} from "../features/games/gamesSlice";
import {
  selectCursor,
  selectErrorLoadingGames,
  selectGames,
  selectHasMoreGames,
  selectLoadingGames,
} from "../features/games/gamesSelector";

export default function useGames() {
  const games = useSelector(selectGames);
  const loadingGames = useSelector(selectLoadingGames);
  const errorLoadingGames = useSelector(selectErrorLoadingGames);
  const cursor = useSelector(selectCursor);
  const hasMoreGames = useSelector(selectHasMoreGames);

  const abortController = useRef(null);

  const dispatch = useDispatch();

  const fetchGames = async (cursor) => {
    if (!hasMoreGames) return;
    dispatch(fetchGamesStart());
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();
    try {
      const response = await getGames(cursor, {
        signal: abortController.current.signal,
      });
      const data = getResponseData(response);
      dispatch(fetchGamesSuccess(data));
    } catch (error) {
      if (error.name === "CanceledError") {
        return;
      }
      console.log("Error fetching games:", error);
      const message = getErrorMessage(error);
      dispatch(fetchGamesFailure(message));
    }
  };

  useEffect(() => {
    if (games && games.length !== 0) return;
    fetchGames();
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return { games, loadingGames, errorLoadingGames, cursor, fetchGames };
}
