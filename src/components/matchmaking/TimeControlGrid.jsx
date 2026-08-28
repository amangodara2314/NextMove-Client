import TimeControlCard from "./TimeControlCard";

export default function TimeControlGrid({ controls, onSelect }) {
  if (controls.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No time controls available for this category.
      </p>
    );
  }

  return (
    <div className="mt-5 flex flex-wrap justify-center gap-3">
      {controls.map((control) => (
        <TimeControlCard
          key={control.title}
          control={control}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
