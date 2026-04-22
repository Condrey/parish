"use client";

import { ChevronsUpDown, LogOutIcon, SunIcon } from "lucide-react";

import LogoutButton from "@/app/(auth)/(database)/logout/logout-button";
import { useSession } from "@/app/session-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import UserAvatar from "@/components/ui/user-avatar";
import { REDIRECT_TO_URL_SEARCH_PARAMS } from "@/lib/constants";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { setTheme } = useTheme();

  const { user } = useSession();
  const [isPending, startTransition] = useTransition();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  newParams.set(REDIRECT_TO_URL_SEARCH_PARAMS, currentPathname);
  const loginUrl = `/login` + "?" + newParams.toString();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {!user ? (
          <Link href={loginUrl}>
            <SidebarMenuButton>
              <LogOutIcon />
              Login now
            </SidebarMenuButton>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserAvatar avatarUrl={user.avatarUrl} />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar avatarUrl={user.avatarUrl} />

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* <DropdownMenuGroup>             
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}

              {/* <DropdownMenuSeparator /> */}

              {/* Mode toggle  */}

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <SunIcon className="mr-2 size-4" />
                  <span>Toggle theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              {/* logging out  */}

              <LogoutButton
                variant={"ghost"}
                className="flex justify-start ps-3 w-full"
              >
                <LogOutIcon className="mr-2 text-inherit" />
                Sign out
              </LogoutButton>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
