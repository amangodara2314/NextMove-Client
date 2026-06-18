import { useEffect, useState } from "react";
import { getGame } from "../services/game/gameServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import socket from "../configs/socket";

export default function useGame(gameId) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gameId) return;

    const controller = new AbortController();

    const joinGame = () => {
      socket.emit("JOIN_GAME", { gameId });
    };

    const fetchGame = async () => {
      try {
        setLoading(true);

        const res = await getGame(gameId, {
          signal: controller.signal,
        });

        const data = getResponseData(res);
        setGame(data.game);

        if (socket.connected) {
          joinGame();
        }

        socket.on("connect", joinGame);
      } catch (error) {
        if (error.name === "AbortError") return;

        const message = getErrorMessage(error);
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchGame();

    return () => {
      controller.abort();
      socket.off("connect", joinGame);
    };
  }, [gameId]);

  return { game, loading, error, setGame };
}
