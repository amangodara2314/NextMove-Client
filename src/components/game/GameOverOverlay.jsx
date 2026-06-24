import { OUTCOME_STYLES } from "../../constants/gameStyles";
import Particles from "./Particles";

export default function GameOverOverlay({ result }) {
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
        className={`absolute inset-0 z-200 flex items-center justify-center rounded-[6px] overflow-hidden ${s.backdrop} backdrop-blur-[3px]`}
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
