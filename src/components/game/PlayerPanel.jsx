function Avatar({ letter, active }) {
  return (
    <div
      className={`
        size-[34px] rounded-full flex-shrink-0 flex items-center justify-center
        text-[13px] font-bold select-none transition-all duration-300
        ${active ? "text-[#0F1117]" : "bg-muted text-muted-foreground"}
      `}
      style={active ? { background: "#D4A847" } : undefined}
    >
      {letter}
    </div>
  );
}

function PlayerPanel({ player, color, active, isYou, borderSide }) {
  return (
    <div
      className={`
        relative h-14 flex-shrink-0 flex items-center gap-3 px-1
        ${active ? "player-active" : ""}
      `}
    >
      <Avatar letter={player.username[0].toUpperCase()} active={active} />

      <div className="space-x-1">
        <span className="text-md font-semibold text-foreground leading-none truncate">
          {player.username}
        </span>
        <span className="text-xs text-muted-foreground leading-none">
          #{player.rating}
        </span>
      </div>
    </div>
  );
}

export default PlayerPanel;
