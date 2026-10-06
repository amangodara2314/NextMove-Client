import { useEffect, useState } from "react";
import {
  acceptDraw,
  checkPlayerTimeout,
  getGame,
  offerDraw,
  resignGame,
} from "../services/game/gameServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import socket from "../configs/socket";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSelectors";
import { setShouldFetchRecentGames } from "../features/games/gamesSlice";
import { showDrawOfferToast } from "../components/game/DrawOfferToast";
import { emitWithAuth } from "../utils/emitWithAuth";

export default function useGame(gameId) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyingPlayerTimeout, setVerifyingPlayerTimeout] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const syncGame = async (signal) => {
    const res = await getGame(gameId, signal ? { signal } : undefined);
    let data = getResponseData(res);
    setGame(data.game);
    return data.game;
  };

  const updateGame = (data) => {
    setGame((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...data,
      };
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

  const handleAcceptDraw = async () => {
    try {
      const response = await acceptDraw(gameId);
      const data = getResponseData(response);
      if (data.game) {
        updateGame(data.game);
      }
    } catch (err) {
      console.log("Error accepting draw:", err);
      toast.error(getErrorMessage(err));
    }
  };

  const applyMoveUpdate = (data) => {
    if (data.status !== "ACTIVE") {
      dispatch(setShouldFetchRecentGames(true));
    }
    console.log("Applying move update:", data);
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
        // if (response?.gameOver) {
        //   updateGame({
        //     status: response.gameStatus ?? game.status,
        //     result: response.gameResult ?? game.result,
        //   });
        // }
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

  useEffect(() => {
    if (!gameId) return;

    const onMoveMade = (data) => applyMoveUpdate(data);

    const onGameAborted = (data) => {
      toast(data.message || "This game has been aborted by opponent");
      updateGame(data);
    };

    const playerReconnected = (data) => {
      const updatedConnectionState = data.updatedConnectionState;
      if (updatedConnectionState) {
        updateGame(updatedConnectionState);
      }
    };

    const onDrawOffer = (data) => {
      const { offeredTo, ttl, gameId: payloadGameId } = data;

      if (offeredTo === user.id && gameId === payloadGameId) {
        showDrawOfferToast({
          ttl,
          onAccept: () => handleAcceptDraw(),
        });
      }
    };

    const onDrawAccepted = (data) => {
      toast("Draw accepted. The game has ended in a draw.");
      updateGame(data);
    };

    const onResign = (data) => {
      if (data.resignedBy === user.id) {
        toast.success("You have resigned the game.");
      } else {
        toast.success("Your opponent has resigned. You win!");
      }
      updateGame(data.updatedGame);
    };

    socket.on("MOVE_MADE", onMoveMade);
    socket.on("GAME_ABORTED", onGameAborted);
    socket.on("PLAYER_RECONNECTED", playerReconnected);
    socket.on("PLAYER_DISCONNECTED", updateGame);
    socket.on("PLAYER_TIMEOUT", updateGame);
    socket.on("DRAW_OFFERED", onDrawOffer);
    socket.on("DRAW_ACCEPTED", onDrawAccepted);
    socket.on("RESIGN", onResign);
    return () => {
      socket.off("MOVE_MADE", onMoveMade);
      socket.off("GAME_ABORTED", onGameAborted);
      socket.off("PLAYER_RECONNECTED", playerReconnected);
      socket.off("PLAYER_DISCONNECTED", updateGame);
      socket.off("PLAYER_TIMEOUT", updateGame);
      socket.off("DRAW_OFFERED", onDrawOffer);
      socket.off("DRAW_ACCEPTED", onDrawAccepted);
    };
  }, [gameId]);

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
