import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSelectors";
import { Button } from "../components/ui/button";
import { ChessKing, ChessQueen } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import socket from "../configs/socket";

export default function Home() {
  const user = useSelector(selectUser);

  return (
    <div className="space-y-6 h-full px-12 pt-16">
      <div className="grid grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-7xl">
            Welcome,{" "}
            <span className="font-semibold">
              {user?.username ? user.username : "Player"}
            </span>{" "}
          </h2>
          {user.rating && (
            <p className="text-2xl">Your current ELO is {user.rating}</p>
          )}
          <Button asChild size={"lg"}>
            <Link to={"/play"}>Play Now</Link>
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <ChessQueen className="w-62 h-62" />

          <ChessKing className="w-62 h-62" />
        </div>
      </div>
    </div>
  );
}
