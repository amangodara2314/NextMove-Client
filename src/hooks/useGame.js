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
    capturedPieces: game?.capturedPieces,
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
      capturedPieces: data.game.capturedPieces,
    };
    return data.game;
  };

  const updateGame = (data) => {
    console.log("Updating game state with data:", data);
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
    if (data.version === gameRef.current.version) {
      return; // No update needed
    }
    const { capturedPiece, capturedBy, ...rest } = data;
    console.log("Applying move update:", capturedPiece, capturedBy);
    if (capturedPiece && capturedBy) {
      rest.capturedPieces = {
        ...gameRef.current.capturedPieces,
        [capturedBy]: [
          capturedPiece,
          ...(gameRef.current.capturedPieces[capturedBy] || []),
        ],
      };
    }
    updateGame(rest);
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
    let initialSyncDone = false;

    const joinGame = () => {
      if (gameRef.current.status !== "ACTIVE") return;
      emitWithAuth("JOIN_GAME", { gameId });
    };

    const onConnect = () => {
      joinGame();

      if (initialSyncDone) {
        syncGame().catch((err) => toast.error(getErrorMessage(err)));
      }
    };

    const fetchInitial = async () => {
      try {
        setLoading(true);
        const gameData = await syncGame(controller.signal);
        initialSyncDone = true;

        if (gameData.status !== "ACTIVE") return;

        if (socket.connected) {
          joinGame();
        } else {
          socket.connect();
        }
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;
        setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    socket.on("connect", onConnect);
    fetchInitial();

    return () => {
      controller.abort();
      socket.off("connect", onConnect);
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
