import { useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/game/Board";
import PlayerPanel from "../components/game/PlayerPanel";
import useGame from "../hooks/useGame";
import Loader from "../components/Loader";
import useMoves from "../hooks/useMoves";
import SidePanel from "../components/game/SidePanel";

export default function Game() {
  const { gameId } = useParams();
  const { game, loading, error, handleMove } = useGame(gameId);
  const { moves, loadingMoves, hasMore, fetchMore } = useMoves(gameId);

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
          <p className="text-muted-foreground text-sm">
            Please try again later.
          </p>
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

  return (
    <div className="h-full flex items-center justify-center p-3 bg-background overflow-hidden">
      <div className="flex items-start gap-3 w-full max-w-5xl h-ful bg-muted rounded-lg px-2">
        {/* ── Board column ── */}
        <div className="flex flex-col flex-1 min-w-0 h-full items-start">
          <PlayerPanel
            player={oppPlayer}
            color={oppColor}
            active={oppActive}
            isYou={false}
            borderSide="top"
          />

          <div className="flex-1 min-h-0 flex items-center justify-center w-full">
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

          <PlayerPanel
            player={myPlayer}
            color={myColor}
            active={myActive}
            isYou={true}
            borderSide="bottom"
          />
        </div>

        {/* ── Side panel (hidden on small screens) ── */}
        <div className="hidden md:flex h-full items-stretch py-8">
          <SidePanel
            game={game}
            moves={moves}
            loadingMoves={loadingMoves}
            hasMore={hasMore}
            fetchMore={fetchMore}
          />
        </div>
      </div>
    </div>
  );
}
