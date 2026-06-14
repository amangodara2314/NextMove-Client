import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Settings,
  User,
  Bell,
  MessageCircle,
  Gamepad,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Home", icon: Home, to: "/" },
  { name: "Play", icon: Gamepad, to: "/play" },
];

export default function FloatingSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed right-4 bottom-0 -translate-y-1/2 z-50 md:hidden bg-black border border-zinc-800 p-2 rounded-full"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <TooltipProvider>
        <div
          className={`
            fixed right-4 top-1/2 -translate-y-1/2 z-40
            flex flex-col gap-4
            rounded-[28px] p-3

            bg-white/10
            backdrop-blur-2xl
            border border-white/20

            shadow-[0_8px_32px_rgba(255,255,255,0.12)]
            ring-1 ring-white/10

            before:absolute
            before:inset-0
            before:rounded-[28px]
            before:bg-gradient-to-b
            before:from-white/20
            before:to-white/5
            before:pointer-events-none

            transition-transform duration-300 ease-in-out
            md:translate-x-0
            ${open ? "translate-x-0" : "translate-x-24 md:translate-x-0"}
        `}
        >
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.to}
                    className="
                        relative
                        p-3
                        rounded-2xl
                        bg-white/5
                        hover:bg-white/15
                        border border-white/10
                        backdrop-blur-xl
                        transition-all duration-300
                        hover:scale-105
                        hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
                    "
                  >
                    <Icon size={20} />
                  </Link>
                </TooltipTrigger>

                <TooltipContent side="left">
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </>
  );
}
