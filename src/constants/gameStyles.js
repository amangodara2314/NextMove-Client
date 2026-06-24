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

export { ANIMATION_STYLES, OUTCOME_STYLES };
