function getGameResult(g, myColor) {
  if (!g.isGameOver()) return null;

  if (g.isCheckmate()) {
    const winnerColor = g.turn() === "w" ? "black" : "white";
    const isWinner = winnerColor === myColor.toLowerCase();
    return {
      over: true,
      outcome: isWinner ? "win" : "lose",
      icon: isWinner ? "♔" : "♚",
      title: isWinner ? "Victory" : "Defeated",
      subtitle: "by checkmate",
      winner: winnerColor,
    };
  }
  if (g.isStalemate())
    return {
      over: true,
      outcome: "draw",
      icon: "½",
      title: "Draw",
      subtitle: "Stalemate",
      winner: null,
    };
  if (g.isThreefoldRepetition())
    return {
      over: true,
      outcome: "draw",
      icon: "½",
      title: "Draw",
      subtitle: "Threefold repetition",
      winner: null,
    };
  if (g.isInsufficientMaterial())
    return {
      over: true,
      outcome: "draw",
      icon: "½",
      title: "Draw",
      subtitle: "Insufficient material",
      winner: null,
    };
  if (g.isDraw())
    return {
      over: true,
      outcome: "draw",
      icon: "½",
      title: "Draw",
      subtitle: "50-move rule",
      winner: null,
    };

  return {
    over: true,
    outcome: "draw",
    icon: "½",
    title: "Game Over",
    subtitle: "",
    winner: null,
  };
}

export default getGameResult;
