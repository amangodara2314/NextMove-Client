import { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const DEFAULT_TIME_SPENT = 10;

const PIECE_LABELS = { q: "Queen", r: "Rook", n: "Knight", b: "Bishop" };
const PROMOTION_PIECES = ["q", "r", "n", "b"];
const PIECE_UNICODE = {
  wq: "♕",
  wr: "♖",
  wn: "♘",
  wb: "♗",
  bq: "♛",
  br: "♜",
  bn: "♞",
  bb: "♝",
};

// ─── CSS animations (injected once) ─────────────────────────────────────────

const ANIMATION_STYLES = `
@keyframes gameover-backdrop {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes gameover-card {
  0%   { opacity: 0; transform: scale(0.82) translateY(12px); }
  60%  { opacity: 1; transform: scale(1.03) translateY(-2px); }
  100% { opacity: 1; transform: scale(1)    translateY(0);    }
}
@keyframes gameover-icon {
  0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
  70%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg);  opacity: 1; }
}
@keyframes gameover-title {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}
@keyframes particle-burst {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
@keyframes glow-ring {
  0%, 100% { box-shadow: 0 0 0 0px var(--ring-color); }
  50%       { box-shadow: 0 0 0 8px var(--ring-color); }
}
`;

function injectStyles() {
  if (document.getElementById("gameover-styles")) return;
  const tag = document.createElement("style");
  tag.id = "gameover-styles";
  tag.textContent = ANIMATION_STYLES;
  document.head.appendChild(tag);
}

// ─── Audio ───────────────────────────────────────────────────────────────────

function playGameOverSound(outcome) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.28, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const schedules = {
      // Win: bright ascending fanfare
      win: [
        { freq: 523.25, start: 0.0, dur: 0.18, type: "triangle", gain: 0.9 },
        { freq: 659.25, start: 0.16, dur: 0.18, type: "triangle", gain: 0.9 },
        { freq: 783.99, start: 0.32, dur: 0.18, type: "triangle", gain: 0.9 },
        { freq: 1046.5, start: 0.48, dur: 0.4, type: "triangle", gain: 1.0 },
        // harmony layer
        { freq: 659.25, start: 0.48, dur: 0.4, type: "sine", gain: 0.5 },
      ],
      // Loss: heavy descending toll
      lose: [
        { freq: 220.0, start: 0.0, dur: 0.55, type: "sawtooth", gain: 0.6 },
        { freq: 174.61, start: 0.45, dur: 0.55, type: "sawtooth", gain: 0.6 },
        { freq: 130.81, start: 0.9, dur: 0.7, type: "sawtooth", gain: 0.7 },
      ],
      // Draw: neutral resolution
      draw: [
        { freq: 440.0, start: 0.0, dur: 0.25, type: "sine", gain: 0.7 },
        { freq: 523.25, start: 0.2, dur: 0.25, type: "sine", gain: 0.7 },
        { freq: 493.88, start: 0.4, dur: 0.45, type: "sine", gain: 0.8 },
      ],
    };

    const notes = schedules[outcome] ?? schedules.draw;
    const now = ctx.currentTime;

    for (const note of notes) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = note.type;
      osc.frequency.setValueAtTime(note.freq, now + note.start);
      g.gain.setValueAtTime(0, now + note.start);
      g.gain.linearRampToValueAtTime(note.gain, now + note.start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.dur);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(now + note.start);
      osc.stop(now + note.start + note.dur + 0.05);
    }

    // Auto-close context after all sounds finish
    const maxEnd = Math.max(...notes.map((n) => n.start + n.dur)) + 0.3;
    setTimeout(() => ctx.close(), (now + maxEnd) * 1000);
  } catch {
    // AudioContext not available — silently skip
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGameResult(g, myColor) {
  if (!g.isGameOver()) return null;

  if (g.isCheckmate()) {
    const winnerColor = g.turn() === "w" ? "black" : "white";
    const isWinner = winnerColor === myColor.toLowerCase();
    return {
      over: true,
      outcome: isWinner ? "win" : "lose",
      icon: isWinner ? "♔" : "♚",
      title: isWinner ? "Victory" : "Defeated",
      subtitle: "by checkmate",
      winner: winnerColor,
    };
  }
  if (g.isStalemate())
    return {
      over: true,
      outcome: "draw",
      icon: "½",
      title: "Draw",
      subtitle: "Stalemate",
      winner: null,
    };
  if (g.isThreefoldRepetition())
    return {
      over: true,
      outcome: "draw",
      icon: "½",
      title: "Draw",
      subtitle: "Threefold repetition",
      winner: null,
    };
  if (g.isInsufficientMaterial())
    return {
      over: true,
      outcome: "draw",
      icon: "½",
      title: "Draw",
      subtitle: "Insufficient material",
      winner: null,
    };
  if (g.isDraw())
    return {
      over: true,
      outcome: "draw",
      icon: "½",
      title: "Draw",
      subtitle: "50-move rule",
      winner: null,
    };

  return {
    over: true,
    outcome: "draw",
    icon: "½",
    title: "Game Over",
    subtitle: "",
    winner: null,
  };
}

// ─── Particle burst (win only) ───────────────────────────────────────────────

function Particles() {
  const COUNT = 18;
  const colors = [
    "#facc15",
    "#fbbf24",
    "#f59e0b",
    "#fde68a",
    "#fff",
    "#d97706",
  ];
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-[6px]"
      style={{ zIndex: 205 }}
    >
      {Array.from({ length: COUNT }).map((_, i) => {
        const angle = (360 / COUNT) * i;
        const dist = 80 + Math.random() * 80;
        const tx = Math.round(Math.cos((angle * Math.PI) / 180) * dist);
        const ty = Math.round(Math.sin((angle * Math.PI) / 180) * dist);
        const color = colors[i % colors.length];
        const size = 6 + Math.round(Math.random() * 6);
        const delay = (Math.random() * 0.25).toFixed(2);
        const dur = (0.55 + Math.random() * 0.35).toFixed(2);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              "--tx": `${tx}px`,
              "--ty": `${ty}px`,
              animation: `particle-burst ${dur}s ${delay}s ease-out forwards`,
              transform: "translate(-50%,-50%)",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── GameOverOverlay ─────────────────────────────────────────────────────────

const OUTCOME_STYLES = {
  win: {
    backdrop: "bg-black/55",
    ring: "rgba(250,204,21,0.55)",
    card: "bg-gradient-to-b from-yellow-950/90 to-stone-950/95 border-yellow-500/30",
    iconColor: "text-yellow-300",
    titleColor: "text-yellow-200",
    subtitleColor: "text-yellow-400/70",
  },
  lose: {
    backdrop: "bg-black/65",
    ring: "rgba(239,68,68,0.45)",
    card: "bg-gradient-to-b from-red-950/90 to-stone-950/95 border-red-500/25",
    iconColor: "text-red-400",
    titleColor: "text-red-200",
    subtitleColor: "text-red-400/60",
  },
  draw: {
    backdrop: "bg-black/55",
    ring: "rgba(148,163,184,0.45)",
    card: "bg-gradient-to-b from-slate-800/90 to-stone-950/95 border-slate-500/25",
    iconColor: "text-slate-300",
    titleColor: "text-slate-100",
    subtitleColor: "text-slate-400/70",
  },
};

function GameOverOverlay({ result }) {
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!result?.over || hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    injectStyles();
    // Small delay so the board re-paint settles first
    const t = setTimeout(() => playGameOverSound(result.outcome), 120);
    return () => clearTimeout(t);
  }, [result]);

  if (!result?.over) return null;

  const s = OUTCOME_STYLES[result.outcome] ?? OUTCOME_STYLES.draw;

  return (
    <>
      {result.outcome === "win" && <Particles />}

      <div
        className={`absolute inset-0 z-[200] flex items-center justify-center rounded-[6px] overflow-hidden ${s.backdrop} backdrop-blur-[3px]`}
        style={{ animation: "gameover-backdrop 0.35s ease forwards" }}
      >
        {/* Glow ring around card */}
        <div
          className="relative flex items-center justify-center"
          style={{
            "--ring-color": s.ring,
            borderRadius: "1.25rem",
            animation: "glow-ring 2s ease-in-out 0.5s infinite",
          }}
        >
          <div
            className={`flex flex-col items-center gap-4 px-12 py-9 rounded-2xl shadow-2xl border text-center select-none ${s.card}`}
            style={{
              animation:
                "gameover-card 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            {/* Icon */}
            <span
              className={`text-6xl leading-none font-bold ${s.iconColor}`}
              style={{
                animation:
                  "gameover-icon 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
              }}
            >
              {result.icon}
            </span>

            {/* Title */}
            <h2
              className={`text-4xl font-bold tracking-tight ${s.titleColor}`}
              style={{ animation: "gameover-title 0.4s ease 0.3s both" }}
            >
              {result.title}
            </h2>

            {/* Subtitle */}
            {result.subtitle && (
              <p
                className={`text-xs font-semibold uppercase tracking-[0.2em] ${s.subtitleColor}`}
                style={{ animation: "gameover-title 0.4s ease 0.45s both" }}
              >
                {result.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── PromotionDialog ─────────────────────────────────────────────────────────

function PromotionDialog({
  squareSize,
  file,
  color,
  orientation,
  onSelect,
  onCancel,
}) {
  if (!squareSize) return null;
  const visualCol = orientation === "white" ? file : 7 - file;
  const left = visualCol * squareSize;

  return (
    <>
      <div
        onClick={onCancel}
        onContextMenu={(e) => {
          e.preventDefault();
          onCancel();
        }}
        className="absolute inset-0 rounded-md z-[100]"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      />
      <div
        className="absolute z-[101] flex flex-col rounded-lg overflow-hidden shadow-2xl border border-white/20"
        style={{ top: 0, left, width: squareSize }}
      >
        {PROMOTION_PIECES.map((piece, i) => {
          const isLight = i % 2 === 0;
          const unicode = PIECE_UNICODE[`${color}${piece}`];
          return (
            <button
              key={piece}
              title={PIECE_LABELS[piece]}
              onClick={() => onSelect(piece)}
              onContextMenu={(e) => e.preventDefault()}
              className={[
                "flex items-center justify-center w-full aspect-square",
                "cursor-pointer border-0 transition-all duration-100",
                "hover:brightness-110 active:scale-95",
                isLight ? "bg-[#F0D9B5]" : "bg-[#B58863]",
              ].join(" ")}
              style={{ fontSize: squareSize * 0.62 }}
            >
              <span
                className={
                  color === "w"
                    ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                    : "text-gray-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]"
                }
                style={{ lineHeight: 1 }}
              >
                {unicode}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─── Board ───────────────────────────────────────────────────────────────────

export default function Board({
  boardWidth,
  boardOrientation = "white",
  position,
  gameId,
  version,
  onMove,
}) {
  const [game, setGame] = useState(() => new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const boardRef = useRef(null);
  const [squareSize, setSquareSize] = useState(0);

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
    if (pendingPromotion || gameResult) return;
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
    if (pendingPromotion || gameResult) return false;

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
    if (pendingPromotion || gameResult) return false;
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

  return (
    <div ref={boardRef} className="relative inline-block">
      {pendingPromotion && (
        <PromotionDialog
          squareSize={squareSize}
          file={promotionFile}
          color={promotingColor}
          orientation={boardOrientation}
          onSelect={handlePromotionSelect}
          onCancel={handlePromotionCancel}
        />
      )}

      {gameResult && <GameOverOverlay result={gameResult} />}

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
