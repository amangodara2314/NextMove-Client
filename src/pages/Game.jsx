import React from "react";
import { useParams } from "react-router-dom";

export default function Game() {
  const { gameId } = useParams();
  return <div>Game: {gameId}</div>;
}
