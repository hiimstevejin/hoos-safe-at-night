"use client";

import * as React from "react";
import {
  PlusCircle,
  MapIcon,
  BookOpen,
  Frame,
  Map,
  PieChart,
  Settings2,
} from "lucide-react";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavChats } from "@/components/dashboard/nav-chat";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Logo from "../../public/logo.svg";

const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  navMain: [
    {
      title: "Create walking group",
      url: "/dashboard/generate",
      icon: MapIcon,
      isActive: true,
    },
    {
      title: "Join walking group",
      url: "/protected/viewpost",
      icon: PlusCircle,
    },
    {
      title: "Create Chat",
      url: "#",
      icon: BookOpen,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
  chats: [
    {
      name: "walk to ohill",
      url: "#",
      icon: Frame,
    },
    {
      name: "walk to JPA",
      url: "#",
      icon: PieChart,
    },
    {
      name: "walk to rotunda",
      url: "#",
      icon: Map,
    },
  ],
};

type UserData = {
  name: string;
  email: string;
  avatar: string;
};

export function AppSidebar({
  user,
  ...props
}: { user: UserData } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/protected">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-12 items-center justify-center rounded-lg">
                  <Image
                    src={Logo}
                    alt="Description of my SVG"
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Hoo Path</span>
                  <span className="truncate text-xs">Walk Home Safe</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavChats chats={data.chats} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
