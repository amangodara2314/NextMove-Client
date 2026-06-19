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
    const data = getResponseData(res);
    setGame(data.game);
  };
  useEffect(() => {
    if (!gameId) return;

    const controller = new AbortController();

    const joinGame = () => {
      socket.emit("JOIN_GAME", { gameId });
      syncGame().catch((err) => {
        setError(getErrorMessage(err));
        toast.error(getErrorMessage(err));
      });
    };

    const fetchInitial = async () => {
      try {
        setLoading(true);
        await syncGame(controller.signal);
      } catch (err) {
        if (err.code === "ERR_CANCELED") return;
        setError(getErrorMessage(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchInitial();
    if (socket.connected) joinGame();
    socket.on("connect", joinGame);

    return () => {
      controller.abort();
      socket.off("connect", joinGame);
    };
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;

    const onMoveMade = (data) => applyMoveUpdate(data);

    socket.on("MOVE_MADE", onMoveMade);

    return () => {
      socket.off("MOVE_MADE", onMoveMade);
    };
  }, [gameId]);

  const applyMoveUpdate = ({ fen, version, move }) => {
    setGame((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentFen: fen,
        version,
        turn: fen.split(" ")[1] === "w" ? "WHITE" : "BLACK",
        lastMove: move,
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
        applyMoveUpdate({
          fen: response.fen,
          version: response.version,
          move: response.move,
        });
        resolve(response);
      });
    });
  };
  return { game, loading, error, setGame, handleMove };
}
