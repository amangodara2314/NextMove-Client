import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function PlayerPanel({ player, color, active, isYou, borderSide }) {
  return (
    <div className={"relative h-14 shrink-0 flex items-center gap-2"}>
      <Avatar className={active ? "ring-1 ring-primary" : ""}>
        <AvatarFallback className="text-secondary-foreground">
          {player.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="space-x-0">
        <span className="text-xl text-foreground leading-none truncate">
          {player.username}
        </span>
        <span className="text-sm text-muted-foreground leading-none">
          #{player.rating}
        </span>
      </div>
    </div>
  );
}

export default PlayerPanel;
