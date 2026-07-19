import { useEffect, useRef, useState } from "react";

const LOW_TIME_MS = 30_000;
const CRITICAL_TIME_MS = 10_000;

function formatTime(ms) {
  const clamped = Math.max(0, ms);
  const totalSeconds = clamped / 1000;

  if (totalSeconds < 10) {
    const seconds = Math.floor(totalSeconds);
    const tenths = Math.floor((clamped % 1000) / 100);
    return `${seconds}.${tenths}`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function ChessClock({ timeLeft = 0, isRunning = false }) {
  const [displayTime, setDisplayTime] = useState(timeLeft);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    setDisplayTime(timeLeft);
    lastTickRef.current = Date.now();
  }, [timeLeft]);

  useEffect(() => {
    if (!isRunning) return;

    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;
      setDisplayTime((prev) => Math.max(0, prev - elapsed));
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  const isLow = displayTime <= LOW_TIME_MS;
  const isCritical = displayTime <= CRITICAL_TIME_MS;

  return (
    <div
      className={[
        "flex items-center justify-center rounded-md border px-2.5 py-1 min-w-[4.5rem]",
        "font-semibold tabular-nums text-lg transition-colors duration-300",
        isRunning
          ? isCritical
            ? "bg-destructive/15 border-destructive text-destructive animate-pulse"
            : isLow
              ? "bg-destructive/10 border-destructive/40 text-destructive"
              : "bg-primary/10 border-primary text-primary"
          : "bg-muted/40 border-transparent text-muted-foreground",
      ].join(" ")}
    >
      {formatTime(displayTime)}
    </div>
  );
}

export default ChessClock;
