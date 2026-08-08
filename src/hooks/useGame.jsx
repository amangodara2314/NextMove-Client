import { useEffect, useState } from "react";
import {
  acceptDraw,
  checkPlayerTimeout,
  getGame,
  offerDraw,
} from "../services/game/gameServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import socket from "../configs/socket";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSelectors";
import { showDrawOfferToast } from "../components/game/DrawOfferToast";
import { emitWithAuth } from "../utils/emitWithAuth";

export default function useGame(gameId) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyingPlayerTimeout, setVerifyingPlayerTimeout] = useState(false);
  const user = useSelector(selectUser);

  const syncGame = async (signal) => {
    const res = await getGame(gameId, signal ? { signal } : undefined);
    let data = getResponseData(res);
    setGame(data.game);
    return data.game;
  };

  const verifyPlayerTimeout = async () => {
    try {
      setVerifyingPlayerTimeout(true);
      const res = await checkPlayerTimeout(gameId);
      const data = getResponseData(res);
      setGame((prev) => {
        return {
          ...prev,
          ...data,
        };
      });
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setVerifyingPlayerTimeout(false);
    }
  };

  const handleOfferDraw = async () => {
    try {
      const response = await offerDraw(gameId);
      toast.success("Draw offer sent.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleAcceptDraw = async () => {
    try {
      const response = await acceptDraw(gameId);
      const data = getResponseData(response);
      if (data.game) {
        setGame((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...data.game,
          };
        });
      }
    } catch (err) {
      console.log("Error accepting draw:", err);
      toast.error(getErrorMessage(err));
    }
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
      toast.error(data.message || "This game has been aborted by opponent");
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "ABORTED",
          abortedBy: data?.abortedBy,
        };
      });
    };

    const playerReconnected = (data) => {
      const updatedData =
        data.color === "WHITE"
          ? { whiteConnected: true }
          : { blackConnected: true };
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...updatedData,
        };
      });
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

    socket.on("MOVE_MADE", onMoveMade);
    socket.on("GAME_ABORTED", onGameAborted);
    socket.on("PLAYER_RECONNECTED", playerReconnected);
    socket.on("PLAYER_DISCONNECTED", updateGame);
    socket.on("PLAYER_TIMEOUT", updateGame);
    socket.on("DRAW_OFFERED", onDrawOffer);
    socket.on("DRAW_ACCEPTED", onDrawAccepted);
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

  const applyMoveUpdate = ({
    fen,
    version,
    move,
    whiteTimeLeft,
    blackTimeLeft,
  }) => {
    setGame((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        fen,
        version,
        turn: fen.split(" ")[1] === "w" ? "WHITE" : "BLACK",
        lastMove: move,
        whiteTimeLeft: Number(whiteTimeLeft),
        blackTimeLeft: Number(blackTimeLeft),
      };
    });
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
        if (response?.gameOver) {
          setGame((prev) => ({
            ...prev,
            status: response.gameStatus ?? prev.status,
            result: response.gameResult ?? prev.result,
          }));
        }
        if (game.version !== response.version) {
          applyMoveUpdate({
            fen: response.fen,
            version: response.version,
            move: response.move,
            whiteTimeLeft: response.whiteTimeLeft,
            blackTimeLeft: response.blackTimeLeft,
          });
        }
        resolve(response);
      });
    });
  };

  return {
    game,
    loading,
    error,
    verifyingPlayerTimeout,
    setGame,
    handleMove,
    verifyPlayerTimeout,
    handleOfferDraw,
  };
}
