import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  LogOut,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import ProjectName from "../ProjectName";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSelectors";
import { NavMain } from "./NavMain";

const pages = [
  {
    name: "Design Engineering",
    url: "#",
    icon: Frame,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChart,
  },
  {
    name: "Travel",
    url: "#",
    icon: Map,
  },
];

export function AppSidebar({ ...props }) {
  const user = useSelector(selectUser);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <ProjectName />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={pages} />
      </SidebarContent>
      <SidebarFooter>
        <Button
          className="cursor-pointer space-x-3"
          variant="ghost"
          size="sm"
          onClick={() => console.log("Logout")}
        >
          <span>Logout</span> <LogOut />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
