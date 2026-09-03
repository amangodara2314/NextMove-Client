import { useEffect, useRef } from "react";
import useGames from "../hooks/useGames";
import GamesList from "../components/home/GamesList";
import { selectUser } from "../features/auth/authSelectors";
import { useSelector } from "react-redux";

export default function Games() {
  const { games, loadingGames, errorLoadingGames, cursor, fetchGames } =
    useGames();
  const loaderRef = useRef(null);
  const user = useSelector(selectUser);

  const handleFetchGames = () => {
    if (cursor) {
      fetchGames(cursor);
    } else {
      fetchGames();
    }
  };

  return (
    <div className="h-full bg-background">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 sm:py-6">
        <h2 className="my-4 text-lg font-medium uppercase tracking-widest text-muted-foreground flex flex-row items-center justify-between space-y-0">
          Your Games History
        </h2>
        <GamesList
          games={games}
          loading={loadingGames}
          error={errorLoadingGames}
          currentUsername={user?.username}
          loaderRef={loaderRef}
          fetchGames={handleFetchGames}
        />
      </div>
    </div>
  );
}
