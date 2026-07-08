import { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import getGameResult from "../../utils/getGameResult";
import { DEFAULT_TIME_SPENT } from "../../constants/pieces";
import PromotionDialog from "./PromotionDialog";
import GameOverOverlay from "./GameOverOverlay";
import AbortedOverlay from "./AbortedOverlay";

export default function Board({
  boardWidth,
  boardOrientation = "white",
  position,
  gameId,
  version,
  onMove,
  canMove,
  selectedMove,
  gameStatus,
  abortedBy,
  myColor,
}) {
  const [game, setGame] = useState(() => new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const boardRef = useRef(null);
  const [squareSize, setSquareSize] = useState(0);

  const isAborted = gameStatus === "ABORTED";
  const abortedByYou = isAborted && abortedBy === myColor;

  useEffect(() => {
    if (!boardRef.current) return;
    const measure = () => {
      const el = boardRef.current?.querySelector("[data-square]");
      if (el) setSquareSize(el.getBoundingClientRect().width);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(boardRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!position) return;
    const g = new Chess(position);
    setGame(g);
    resetSelection();
    setPendingPromotion(null);
    const result = getGameResult(
      g,
      boardOrientation === "white" ? "WHITE" : "BLACK",
    );
    if (result) setGameResult(result);
  }, [position]);

  function safeGameMutate(modify) {
    setGame((g) => {
      const updated = new Chess(g.fen());
      modify(updated);
      return updated;
    });
  }

  function getMoveOptions(square, currentGame) {
    const moves = currentGame.moves({ square, verbose: true });
    if (!moves.length) {
      setOptionSquares({});
      return false;
    }
    const newSquares = {};
    for (const move of moves) {
      const targetPiece = currentGame.get(move.to);
      const isCapture =
        targetPiece && targetPiece.color !== currentGame.get(square)?.color;
      newSquares[move.to] = {
        background: isCapture
          ? "radial-gradient(circle, rgba(0,0,0,.18) 80%, transparent 80%)"
          : "radial-gradient(circle, rgba(0,0,0,.18) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    }
    newSquares[square] = { background: "rgba(212,168,71,0.45)" };
    setOptionSquares(newSquares);
    return true;
  }

  function resetSelection() {
    setMoveFrom("");
    setOptionSquares({});
  }

  function isPromotionMove(from, to, currentGame) {
    const piece = currentGame.get(from);
    return (
      piece?.type === "p" &&
      ((piece.color === "w" && to[1] === "8") ||
        (piece.color === "b" && to[1] === "1"))
    );
  }

  function checkAndSetGameResult(updatedGame) {
    const result = getGameResult(
      updatedGame,
      boardOrientation === "white" ? "WHITE" : "BLACK",
    );
    if (result) setGameResult(result);
  }

  async function submitMove(from, to, promotion) {
    try {
      await onMove({
        gameId,
        from,
        to,
        promotion,
        version,
        timeSpent: DEFAULT_TIME_SPENT,
        timestamp: new Date().toISOString(),
      });
    } catch {
      setGame(new Chess(position || undefined));
    }
  }

  function openPromotionDialog(from, to) {
    const fenBeforeMove = game.fen();
    safeGameMutate((g) => {
      try {
        g.move({ from, to, promotion: "q" });
      } catch {
        /* illegal */
      }
    });
    resetSelection();
    setPendingPromotion({ from, to, fenBeforeMove });
  }

  function handlePromotionSelect(piece) {
    if (!pendingPromotion) return;
    const { from, to, fenBeforeMove } = pendingPromotion;
    const g = new Chess(fenBeforeMove);
    g.move({ from, to, promotion: piece });
    setGame(g);
    setPendingPromotion(null);
    checkAndSetGameResult(g);
    submitMove(from, to, piece);
  }

  function handlePromotionCancel() {
    if (!pendingPromotion) return;
    setGame(new Chess(pendingPromotion.fenBeforeMove));
    setPendingPromotion(null);
    resetSelection();
  }

  function onSquareClick({ square }) {
    if (pendingPromotion || gameResult || !canMove) return;
    const clickedPiece = game.get(square);
    const isOwnPiece =
      clickedPiece && clickedPiece.color === boardOrientation[0];

    if (!moveFrom) {
      if (isOwnPiece) {
        const hasMoves = getMoveOptions(square, game);
        if (hasMoves) setMoveFrom(square);
      }
      return;
    }

    if (isOwnPiece && square !== moveFrom) {
      const hasMoves = getMoveOptions(square, game);
      if (hasMoves) setMoveFrom(square);
      return;
    }

    const moves = game.moves({ square: moveFrom, verbose: true });
    const validMove = moves.find((m) => m.to === square);
    if (!validMove) {
      resetSelection();
      return;
    }

    const from = moveFrom;
    const to = square;

    if (isPromotionMove(from, to, game)) {
      openPromotionDialog(from, to);
      return;
    }

    let updatedGame;
    safeGameMutate((g) => {
      g.move({ from, to });
      updatedGame = g;
    });
    resetSelection();
    if (updatedGame) checkAndSetGameResult(updatedGame);
    submitMove(from, to, undefined);
  }

  function onPieceDrop({ sourceSquare, targetSquare }) {
    if (isAborted || pendingPromotion || gameResult || !canMove) return false;

    if (isPromotionMove(sourceSquare, targetSquare, game)) {
      openPromotionDialog(sourceSquare, targetSquare);
      return true;
    }

    let moved = false;
    let updatedGame;
    safeGameMutate((g) => {
      try {
        const result = g.move({ from: sourceSquare, to: targetSquare });
        if (result) {
          moved = true;
          updatedGame = g;
        }
      } catch {
        /* illegal */
      }
    });
    resetSelection();

    if (moved) {
      if (updatedGame) checkAndSetGameResult(updatedGame);
      submitMove(sourceSquare, targetSquare, undefined);
    }
    return moved;
  }

  function canDragPiece({ piece }) {
    if (isAborted || pendingPromotion || gameResult || !canMove) return false;
    const pieceColor = piece.pieceType[0];
    return (
      pieceColor === game.turn() &&
      pieceColor === (boardOrientation === "white" ? "w" : "b")
    );
  }

  const promotionFile = pendingPromotion
    ? pendingPromotion.to.charCodeAt(0) - "a".charCodeAt(0)
    : null;
  const promotingColor = pendingPromotion
    ? (game.get(pendingPromotion.to)?.color ?? boardOrientation[0])
    : null;

  let showGameOverOverlay = false;
  if (!isAborted) {
    if (!selectedMove) {
      showGameOverOverlay = !!gameResult;
    } else {
      showGameOverOverlay =
        selectedMove.isCheckmate || selectedMove.isStalemate ? true : false;
    }
  }

  return (
    <div ref={boardRef} className="relative inline-block">
      {pendingPromotion && !isAborted && (
        <PromotionDialog
          squareSize={squareSize}
          file={promotionFile}
          color={promotingColor}
          orientation={boardOrientation}
          onSelect={handlePromotionSelect}
          onCancel={handlePromotionCancel}
        />
      )}

      {isAborted && <AbortedOverlay abortedByYou={abortedByYou} />}

      {!isAborted && showGameOverOverlay && (
        <GameOverOverlay result={gameResult} />
      )}

      <Chessboard
        options={{
          position: game.fen(),
          boardOrientation,
          boardWidth: boardWidth || undefined,
          onPieceDrop,
          onSquareClick,
          canDragPiece,
          squareStyles: optionSquares,
          darkSquareStyle: { backgroundColor: "#B58863" },
          lightSquareStyle: { backgroundColor: "#F0D9B5" },
          boardStyle: {
            borderRadius: 6,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          },
        }}
      />
    </div>
  );
}
