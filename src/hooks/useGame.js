import { useEffect, useRef, useState } from "react";
import {
  checkPlayerTimeout,
  getGame,
  offerDraw,
  resignGame,
} from "../services/game/gameServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import socket from "../configs/socket";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setShouldFetchRecentGames } from "../features/games/gamesSlice";
import { emitWithAuth } from "../utils/emitWithAuth";
import { setRating } from "../features/rating/ratingSlice";
import useGameEvents from "./useGameEvents";

const userRatingAfter = {
  WHITE: "whiteRatingAfter",
  BLACK: "blackRatingAfter",
};

export default function useGame(gameId) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyingPlayerTimeout, setVerifyingPlayerTimeout] = useState(false);
  const gameRef = useRef({
    status: game?.status,
    userColor: game?.userColor,
    timeControl: game?.timeControl,
  });
  const dispatch = useDispatch();

  const syncGame = async (signal) => {
    const res = await getGame(gameId, signal ? { signal } : undefined);
    let data = getResponseData(res);
    setGame(data.game);
    gameRef.current = {
      status: data.game.status,
      userColor: data.game.userColor,
      timeControl: data.game.timeControl,
    };
    return data.game;
  };

  const updateGame = (data) => {
    if (
      data.status &&
      data.status !== gameRef.current.status &&
      gameRef.current.status === "ACTIVE"
    ) {
      // Handle game status change
      dispatch(
        setRating({
          rating: data[userRatingAfter[gameRef.current.userColor]],
          type: gameRef.current.timeControl.split("_")[0],
        }),
      );
      dispatch(setShouldFetchRecentGames(true));
    }

    gameRef.current = {
      ...gameRef.current,
      ...data,
    };

    setGame((prev) => {
      if (!prev) return prev;

      const updatedGame = {
        ...prev,
        ...data,
      };

      return updatedGame;
    });
  };

  const verifyPlayerTimeout = async () => {
    try {
      setVerifyingPlayerTimeout(true);
      const res = await checkPlayerTimeout(gameId);
      const data = getResponseData(res);
      updateGame(data);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setVerifyingPlayerTimeout(false);
    }
  };

  const handleOfferDraw = async () => {
    try {
      await offerDraw(gameId);
      toast.success("Draw offer sent.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleResign = async () => {
    try {
      const res = await resignGame(gameId);
      const data = getResponseData(res);
      updateGame(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const applyMoveUpdate = (data) => {
    updateGame(data);
  };

  const handleMove = (data) => {
    return new Promise((resolve, reject) => {
      emitWithAuth("MAKE_MOVE", data, (response) => {
        if (!response?.success) {
          if (response?.message === "STALE_STATE") {
            toast.error("Board was out of sync — refreshing...");
            syncGame().catch((err) => {
              setError(getErrorMessage(err));
              toast.error(getErrorMessage(err));
            });
          } else {
            toast.error(response?.message || "Failed to make move");
          }
          reject(response);
          return;
        }

        if (game.version !== response.version) {
          applyMoveUpdate(response);
        }
        resolve(response);
      });
    });
  };

  useEffect(() => {
    if (!gameId) return;

    const controller = new AbortController();

    const joinGame = (shouldSync = true) => {
      emitWithAuth("JOIN_GAME", { gameId });
      if (shouldSync) {
        syncGame().catch((err) => {
          setError(getErrorMessage(err));
          toast.error(getErrorMessage(err));
        });
      }
    };

    const fetchInitial = async () => {
      try {
        setLoading(true);
        const gameData = await syncGame(controller.signal);
        if (!socket.connected) {
          console.log("Socket not connected. skipping join game...");
          // await socket.connect();
          // console.log("Connecting to socket server...");
        }

        if (socket.connected && gameData.status === "ACTIVE") joinGame(false);
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;
        console.log("Error fetching game:", err);
        setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchInitial();

    if (game && game.status === "ACTIVE") socket.on("connect", joinGame);

    return () => {
      controller.abort();
      socket.off("connect", joinGame);
    };
  }, [gameId]);

  useGameEvents({ gameId, updateGame, applyMoveUpdate });

  return {
    game,
    loading,
    error,
    verifyingPlayerTimeout,
    setGame,
    handleMove,
    verifyPlayerTimeout,
    handleOfferDraw,
    handleResign,
  };
}
