export default function Play() {
  return (
    <div className="h-full bg-primary px-12 pt-16">
      <div className="aspect-square w-1/2 grid grid-cols-8 overflow-hidden rounded-xl">
        {Array.from({ length: 64 }, (_, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          const isDark = (row + col) % 2 === 1;

          return (
            <div
              key={index}
              className={isDark ? "bg-emerald-700" : "bg-amber-100"}
            />
          );
        })}
      </div>
    </div>
  );
}
