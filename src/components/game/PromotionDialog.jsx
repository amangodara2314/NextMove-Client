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

export default PromotionDialog;
