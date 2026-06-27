import { useEffect, useRef, useState } from "react";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import { getMoves } from "../services/game/gameServices";
import socket from "../configs/socket";

export default function useMoves(gameId, isGameActive = false) {
  const [moves, setMoves] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loadingMoves, setLoadingMoves] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [movesError, setMovesError] = useState(null);
  const [selectedMove, setSelectedMove] = useState(null);
  const fetchingRef = useRef(false);
  const hasConnectedOnceRef = useRef(false);

  const fetchMoves = async (resetStates = false) => {
    if (!gameId || !hasMore || fetchingRef.current) return;

    console.log("reset states:", resetStates);

    fetchingRef.current = true;

    try {
      setLoadingMoves(true);

      const result = await getMoves(gameId, cursor);
      const data = getResponseData(result);
      const fromDB = data.source === "db";

      if (resetStates) {
        setMoves(data.moves);
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } else {
        if (fromDB) {
          setMoves((prev) => [...prev, ...data.moves]);
        } else {
          setMoves((prev) => [...data.moves, ...prev]);
        }
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      if (error.code === "ERR_CANCELED") return;
      setMovesError(getErrorMessage(error));
    } finally {
      fetchingRef.current = false;
      setLoadingMoves(false);
    }
  };

  useEffect(() => {
    fetchMoves();
  }, [gameId]);

  useEffect(() => {
    if (!isGameActive) return;
    const handleReconnect = () => {
      if (!hasConnectedOnceRef.current) {
        hasConnectedOnceRef.current = true;
        return;
      }
      fetchMoves(true);
    };

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("connect", handleReconnect);
    };
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;

    const onMoveMade = (data) => {
      console.log("move_made event received:", data);
      if (data.move) {
        setMoves((prev) => [...prev, data.move]);
      }
    };

    socket.on("MOVE_MADE", onMoveMade);

    return () => {
      socket.off("MOVE_MADE", onMoveMade);
    };
  }, [gameId]);

  return {
    moves,
    loadingMoves,
    movesError,
    hasMore,
    fetchMore: () => fetchMoves(false),
    selectedMove,
    setSelectedMove,
  };
}
