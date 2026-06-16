import { useState } from "react";
import { useParams } from "react-router-dom";
import Board from "../components/game/Board";
import PlayerPanel from "../components/game/PlayerPanel";

const MOCK_GAME = {
  id: "b3ac7296-c64e-46f2-b992-2267e4b16390",
  turn: "WHITE",
  result: null,
  status: "ACTIVE",
  createdAt: "2026-06-14T04:06:45.877Z",
  whitePlayer: { username: "aman", rating: 1200 },
  blackPlayer: { username: "aman", rating: 1200 },
  currentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  userColor: "BLACK",
};

export default function Game() {
  const { gameId } = useParams();
  const [game] = useState(MOCK_GAME);

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
      <div className="flex items-start gap-3 w-full max-w-[594px] h-full">
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
                position={game.currentFen}
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
