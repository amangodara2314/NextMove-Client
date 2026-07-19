import { useEffect, useState } from "react";
import socket from "../configs/socket";
import { useNavigate } from "react-router-dom";
import { newGame } from "../services/matchmaking/matchmakingServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";

export default function useMatchmaking() {
  const [error, setError] = useState(null);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedControl, setSelectedControl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMatchFound = (data) => {
      socket.emit("MATCH_ACK", { reservationId: data.reservationId });
    };

    const handleNoMatchFound = () => {
      console.log("No match found");
      setIsSearching(false);
      setNoMatchFound(true);
    };

    const handleMatchReady = (data) => {
      navigate(`/game/${data.gameId}`, { replace: true });
    };

    socket.on("MATCH_FOUND", handleMatchFound);
    socket.on("NO_MATCH_FOUND", handleNoMatchFound);
    socket.on("MATCH_READY", handleMatchReady);

    return () => {
      socket.off("MATCH_FOUND", handleMatchFound);
      socket.off("NO_MATCH_FOUND", handleNoMatchFound);
      socket.off("MATCH_READY", handleMatchReady);
      socket.emit("CANCEL_MATCHMAKING");
    };
  }, []);

  const startMatchmaking = async (control) => {
    setError(null);
    setNoMatchFound(false);
    setSelectedControl(control);
    setIsSearching(true);

    try {
      const response = await newGame({
        timeControl: control.timeControl,
      });
      const data = getResponseData(response);
      if (data?.gameId) {
        navigate(`/game/${data.gameId}`, { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setIsSearching(false);
    }
  };

  const cancelSearch = () => {
    socket.emit("CANCEL_MATCHMAKING");
    setIsSearching(false);
    setSelectedControl(null);
  };

  const retrySearch = () => {
    setNoMatchFound(false);
    if (selectedControl) startMatchmaking(selectedControl);
  };

  const backToSelection = () => {
    setNoMatchFound(false);
    setError(null);
    setSelectedControl(null);
  };

  return {
    error,
    noMatchFound,
    isSearching,
    selectedControl,
    startMatchmaking,
    cancelSearch,
    retrySearch,
    backToSelection,
  };
}
