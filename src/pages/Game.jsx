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
  const {
    moves,
    loadingMoves,
    hasMore,
    fetchMore,
    selectedMove,
    setSelectedMove,
  } = useMoves(gameId, game?.status === "ACTIVE");

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

  const opponentProps = {
    player: myColor === "WHITE" ? game.blackPlayer : game.whitePlayer,
    color: myColor === "WHITE" ? "BLACK" : "WHITE",
    active: game.turn !== myColor,
    isYou: false,
    borderSide: "top",
    isConnected:
      (myColor === "WHITE" ? game.blackConnected : game.whiteConnected) ?? true,
    gameStatus: game.status,
    timeLeft: myColor === "WHITE" ? game.blackTimeLeft : game.whiteTimeLeft,
  };

  const myProps = {
    player: myColor === "WHITE" ? game.whitePlayer : game.blackPlayer,
    color: myColor,
    active: game.turn === myColor,
    isYou: true,
    borderSide: "bottom",
    isConnected:
      (myColor === "WHITE" ? game.whiteConnected : game.blackConnected) ?? true,
    gameStatus: game.status,
    timeLeft: myColor === "WHITE" ? game.whiteTimeLeft : game.blackTimeLeft,
  };

  return (
    <div className="md:h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 w-full max-w-4xl md:h-[95vh] min-h-0 rounded-lg px-4 py-1 md:border md:border-border">
        {/* ── Board column ── */}
        <div className="flex flex-col h-full min-h-0 overflow-hidden md:col-span-2">
          <PlayerPanel {...opponentProps} />

          <div className="flex-1 min-h-0 flex justify-center md:justify-start items-center w-full">
            <div className="board-inner">
              <Board
                boardOrientation={myColor === "WHITE" ? "white" : "black"}
                position={selectedMove?.fenAfter || game.fen}
                canMove={
                  selectedMove && !selectedMove?.isLast
                    ? false
                    : game.turn === myColor
                }
                selectedMove={selectedMove}
                version={game.version}
                gameId={game.id}
                onMove={handleMove}
                gameStatus={game.status}
                abortedBy={game.abortedBy}
                myColor={myColor}
              />
            </div>
          </div>

          <PlayerPanel {...myProps} />
        </div>
        <div className="h-76 md:h-full min-h-0 overflow-hidden md:p-4">
          <SidePanel
            game={game}
            moves={moves}
            myColor={myColor}
            loadingMoves={loadingMoves}
            hasMore={hasMore}
            fetchMore={fetchMore}
            selectedMove={selectedMove}
            setSelectedMove={setSelectedMove}
          />
        </div>
      </div>
    </div>
  );
}
