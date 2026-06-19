import { useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/game/Board";
import PlayerPanel from "../components/game/PlayerPanel";
import useGame from "../hooks/useGame";
import Loader from "../components/Loader";

export default function Game() {
  const { gameId } = useParams();
  const { game, loading, error, setGame, handleMove } = useGame(gameId);

  if (loading) {
    return (
      <div className="h-dvh w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh w-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-destructive text-2xl font-semibold">{error}</p>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  const myColor = game.userColor;
  const oppColor = myColor === "WHITE" ? "BLACK" : "WHITE";
  const myPlayer = myColor === "WHITE" ? game.whitePlayer : game.blackPlayer;
  const oppPlayer = oppColor === "WHITE" ? game.whitePlayer : game.blackPlayer;
  const myActive = game.turn === myColor;
  const oppActive = game.turn === oppColor;

  const started = new Date(game.createdAt);
  const startedStr =
    started.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
    " · " +
    started.toLocaleDateString([], { month: "short", day: "numeric" });

  return (
    <div className="h-full flex items-center justify-center p-3 bg-background overflow-hidden">
      <div className="flex items-start gap-3 w-full max-w-148.5 h-full">
        {/* ── Board column ── */}
        <div className="flex flex-col flex-1 min-w-0 h-full items-start">
          {/* Opponent */}
          <PlayerPanel
            player={oppPlayer}
            color={oppColor}
            active={oppActive}
            isYou={false}
            borderSide="top"
          />

          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="board-inner">
              <Board
                boardOrientation={myColor === "WHITE" ? "white" : "black"}
                position={game.fen}
                version={game.version}
                gameId={game.id}
                onMove={handleMove}
              />
            </div>
          </div>

          {/* Me */}
          <PlayerPanel
            player={myPlayer}
            color={myColor}
            active={myActive}
            isYou={true}
            borderSide="bottom"
          />
        </div>
      </div>
    </div>
  );
}
