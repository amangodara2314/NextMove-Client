import { ArrowLeft, Swords } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "../components/Loader";
import CategorySwitcher from "../components/matchmaking/CategorySwitcher.jsx";
import TimeControlGrid from "../components/matchmaking/TimeControlGrid.jsx";
import SearchingState from "../components/matchmaking/SearchingState.jsx";
import NoMatchFoundState from "../components/matchmaking/NoMatchFoundState.jsx";
import SettingsErrorState from "../components/matchmaking/SettingsErrorState.jsx";
import useTimeControlSettings from "../hooks/useTimeControlSettings.js";
import useMatchmaking from "../hooks/useMatchmaking.js";
import { selectRating } from "../features/rating/ratingSelectors.js";

export default function Matchmaking() {
  const {
    type,
    setType,
    types,
    settings,
    loadingSettings,
    error: settingsError,
    fetchTimeControlSettings,
  } = useTimeControlSettings();

  const {
    error,
    noMatchFound,
    isSearching,
    selectedControl,
    startMatchmaking,
    cancelSearch,
    retrySearch,
    backToSelection,
  } = useMatchmaking();

  const navigate = useNavigate();

  const { ratings } = useSelector(selectRating);

  useEffect(() => {
    if (!type && types?.length) {
      setType(types[1]);
    }
  }, [types, type, setType]);

  if (!settings && loadingSettings) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (settingsError && !settings) {
    return (
      <SettingsErrorState
        message={settingsError}
        onRetry={fetchTimeControlSettings}
      />
    );
  }

  if (noMatchFound) {
    return (
      <NoMatchFoundState
        onChangeTimeControl={backToSelection}
        onRetry={retrySearch}
      />
    );
  }

  const searchRating = ratings.find((r) => r.type === type);

  if (isSearching) {
    return (
      <SearchingState
        type={type}
        selectedControl={selectedControl}
        rating={ratings?.[type]}
        error={error}
        onCancel={cancelSearch}
        onRetry={backToSelection}
      />
    );
  }

  const activeSettings = settings?.[type] ?? [];

  return (
    <div className="h-full bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="text-center space-y-2 mb-8">
          <div className="relative flex justify-center mb-3">
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl" />
            <div className="relative p-3 rounded-2xl bg-card border border-border">
              <Swords className="size-6" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Play Online</h1>
          <p className="text-sm text-muted-foreground">
            Choose a time control to find your opponent
          </p>
        </div>

        <CategorySwitcher
          types={types}
          activeType={type}
          onChange={setType}
          ratings={ratings}
        />

        <TimeControlGrid
          controls={activeSettings}
          onSelect={startMatchmaking}
        />

        {error && (
          <p className="text-sm text-destructive text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
