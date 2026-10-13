export function formatIncrement(increment) {
  if (!increment) return null;
  return `+${increment / 1000}s`;
}

export const getPlayerProps = (color, isYou, game) => {
  const side = color === "WHITE" ? "white" : "black";
  return {
    player: game[`${side}Player`],
    color,
    active: isYou ? game.turn === color : game.turn !== color,
    isYou,
    borderSide: isYou ? "bottom" : "top",
    isConnected: game[`${side}Connected`] ?? true,
    gameStatus: game.status,
    timeLeft: game[`${side}TimeLeft`],
    ratingBefore: game[`${side}RatingBefore`],
    ratingAfter: game[`${side}RatingAfter`],
    ratingChange: game[`${side}RatingChange`],
  };
};

export const getRatingData = (myColor, game) => {
  const mySide = myColor === "WHITE" ? "white" : "black";
  const opponentSide = mySide === "white" ? "black" : "white";
  return {
    myRatingBefore: game[`${mySide}RatingBefore`],
    myRatingAfter: game[`${mySide}RatingAfter`],
    myRatingChange: game[`${mySide}RatingChange`],
    opponentRatingBefore: game[`${opponentSide}RatingBefore`],
    opponentRatingAfter: game[`${opponentSide}RatingAfter`],
    opponentRatingChange: game[`${opponentSide}RatingChange`],
  };
};
