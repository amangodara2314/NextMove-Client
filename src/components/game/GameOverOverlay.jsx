import { useEffect, useRef } from "react";
import { OUTCOME_STYLES } from "../../constants/gameStyles";
import Particles from "./Particles";
import playGameOverSound from "../../utils/gameSounds";

export default function GameOverOverlay({ result }) {
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (!result?.over || hasPlayedRef.current) return;

    hasPlayedRef.current = true;

    // Small delay so the board repaint settles first
    const t = setTimeout(() => playGameOverSound(result.outcome), 120);

    return () => clearTimeout(t);
  }, [result]);

  if (!result?.over) return null;

  const s = OUTCOME_STYLES[result.outcome] ?? OUTCOME_STYLES.draw;

  return (
    <>
      {result.outcome === "win" && <Particles />}

      <div
        className={`absolute inset-0 z-[200] flex items-center justify-center rounded-[6px] overflow-hidden gameover-backdrop ${s.backdrop}`}
      >
        {/* Glow ring */}
        <div
          className="relative flex items-center justify-center glow-ring"
          style={{
            "--ring-color": s.ring,
            borderRadius: "1.25rem",
          }}
        >
          {/* Main card */}
          <div
            className={`gameover-card flex flex-col items-center gap-4 px-12 py-9 rounded-2xl shadow-2xl border text-center select-none ${s.card}`}
          >
            {/* Icon */}
            <span
              className={`gameover-icon text-6xl leading-none font-bold ${s.iconColor}`}
            >
              {result.icon}
            </span>

            {/* Title */}
            <h2
              className={`gameover-title text-4xl font-bold tracking-tight ${s.titleColor}`}
            >
              {result.title}
            </h2>

            {/* Subtitle */}
            {result.subtitle && (
              <p
                className={`gameover-subtitle text-xs font-semibold uppercase tracking-[0.2em] ${s.subtitleColor}`}
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
