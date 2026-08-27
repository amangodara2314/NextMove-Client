export function formatIncrement(increment) {
  if (!increment) return null;
  return `+${increment / 1000}s`;
}
