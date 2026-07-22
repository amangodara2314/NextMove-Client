import { useEffect, useState } from "react";
import { getGame } from "../services/game/gameServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import socket from "../configs/socket";
import { toast } from "sonner";

export default function useGame(gameId) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const syncGame = async (signal) => {
    const res = await getGame(gameId, signal ? { signal } : undefined);
    let data = getResponseData(res);
    setGame(data.game);
    return data.game;
  };

  useEffect(() => {
    if (!gameId) return;

    const controller = new AbortController();

    const joinGame = (shouldSync = true) => {
      socket.emit("JOIN_GAME", { gameId });
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

    const playerDisconnected = (data) => {
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          ...data,
        };
      });
    };

    socket.on("MOVE_MADE", onMoveMade);
    socket.on("GAME_ABORTED", onGameAborted);
    socket.on("PLAYER_RECONNECTED", playerReconnected);
    socket.on("PLAYER_DISCONNECTED", playerDisconnected);
    return () => {
      socket.off("MOVE_MADE", onMoveMade);
      socket.off("GAME_ABORTED", onGameAborted);
      socket.off("PLAYER_RECONNECTED", playerReconnected);
      socket.off("PLAYER_DISCONNECTED", playerDisconnected);
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
        whiteTimeLeft,
        blackTimeLeft,
      };
    });
  };

  const handleMove = (data) => {
    return new Promise((resolve, reject) => {
      socket.emit("MAKE_MOVE", data, (response) => {
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
          }));
        }
        applyMoveUpdate({
          fen: response.fen,
          version: response.version,
          move: response.move,
          whiteTimeLeft: response.whiteTimeLeft,
          blackTimeLeft: response.blackTimeLeft,
        });
        resolve(response);
      });
    });
  };

  return { game, loading, error, setGame, handleMove };
}
