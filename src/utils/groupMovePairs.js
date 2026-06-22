function groupMovePairs(moves) {
  const pairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      num: Math.ceil(moves[i].moveNumber / 2),
      white: moves[i] ?? null,
      black: moves[i + 1] ?? null,
    });
  }
  return pairs;
}

export default groupMovePairs;
