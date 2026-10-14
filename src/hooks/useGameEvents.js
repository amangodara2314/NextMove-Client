import { useEffect } from "react";
import { acceptDraw } from "../services/game/gameServices";
import { getErrorMessage, getResponseData } from "../utils/responseHelpers";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSelectors";
import socket from "../configs/socket";
import { showDrawOfferToast } from "../components/game/DrawOfferToast";

export default function useGameEvents({
  gameId,
  applyMoveUpdate = () => {},
  updateGame = () => {},
}) {
  const user = useSelector(selectUser);

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
}
