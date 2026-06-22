import { useEffect, useState } from "react";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import { getMoves } from "../services/game/gameServices";
import socket from "../configs/socket";

export default function useMoves(gameId) {
  const [moves, setMoves] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loadingMoves, setLoadingMoves] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [movesError, setMovesError] = useState(null);

  const fetchMoves = async () => {
    if (!gameId || !hasMore) return;

    try {
      setLoadingMoves(true);

      const result = await getMoves(gameId, cursor);
      const data = getResponseData(result);

      setMoves((prev) => [...prev, ...data.moves]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      if (error.code === "ERR_CANCELED") return;
      setMovesError(getErrorMessage(error));
    } finally {
      setLoadingMoves(false);
    }
  };

  useEffect(() => {
    fetchMoves();
  }, [gameId]);

  useEffect(() => {
    const handleReconnect = () => {
      fetchMoves();
    };

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
    };
  }, [gameId]);

  return {
    moves,
    loadingMoves,
    movesError,
    hasMore,
    fetchMore: fetchMoves,
  };
}
