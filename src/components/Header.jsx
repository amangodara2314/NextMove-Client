import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSelectors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProjectName from "./ProjectName";
function Header() {
  const user = useSelector(selectUser);
  console.log(user);
  return (
    <div className="py-3 border-b border-border bg-sidebar text-sidebar-foreground flex items-center justify-between px-6">
      <ProjectName />
      <ul className="flex text-md items-center gap-8">
        <li>
          <a href="/" className="hover:text-primary/80">
            Play
          </a>
        </li>
        <li>
          <a href="/about" className="hover:text-primary/80">
            Games
          </a>
        </li>
        <li className="cursor-pointer">
          <Avatar>
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>
              {user?.username[0].toUpperCase() || "P"}
            </AvatarFallback>
          </Avatar>
        </li>
      </ul>
    </div>
  );
}

export default Header;
