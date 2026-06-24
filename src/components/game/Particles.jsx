const COUNT = 18;
const colors = ["#facc15", "#fbbf24", "#f59e0b", "#fde68a", "#fff", "#d97706"];
export default function Particles() {
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
