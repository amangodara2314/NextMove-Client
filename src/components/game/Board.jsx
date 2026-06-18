import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function Board({
  boardWidth,
  boardOrientation = "white",
  position: initialPosition,
}) {
  const [game, setGame] = useState(
    () => new Chess(initialPosition || undefined),
  );
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});

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

  // v5 API: receives ({ square, piece })
  function onSquareClick({ square }) {
    const clickedPiece = game.get(square);
    const isOwnPiece =
      clickedPiece && clickedPiece.color === boardOrientation[0]; // "w" or "b"

    if (!moveFrom) {
      if (isOwnPiece) {
        const hasMoves = getMoveOptions(square, game);
        if (hasMoves) setMoveFrom(square);
      }
      return;
    }

    // Re-select a different own piece
    if (isOwnPiece && square !== moveFrom) {
      const hasMoves = getMoveOptions(square, game);
      if (hasMoves) setMoveFrom(square);
      return;
    }

    // Attempt the move
    const moves = game.moves({ square: moveFrom, verbose: true });
    const validMove = moves.find((m) => m.to === square);
    if (!validMove) {
      resetSelection();
      return;
    }

    safeGameMutate((g) => {
      g.move({ from: moveFrom, to: square, promotion: "q" });
    });
    resetSelection();
  }

  // v5 API: receives ({ sourceSquare, targetSquare, piece })
  function onPieceDrop({ sourceSquare, targetSquare }) {
    let moved = false;
    safeGameMutate((g) => {
      try {
        const result = g.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });
        if (result) moved = true;
      } catch {
        // illegal move — leave board unchanged
      }
    });
    resetSelection();
    return moved;
  }

  function canDragPiece({ piece }) {
    const pieceColor = piece.pieceType[0]; // "w" or "b"
    return (
      pieceColor === game.turn() &&
      pieceColor === (boardOrientation === "white" ? "w" : "b")
    );
  }

  return (
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
  );
}
