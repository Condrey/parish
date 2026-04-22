"use client";

import {
  ChevronsUpDown,
  LogInIcon,
  LogOutIcon,
  Settings2Icon,
  SunIcon,
} from "lucide-react";

import LogoutButton from "@/app/(auth)/(database)/logout/logout-button";
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
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { REDIRECT_TO_URL_SEARCH_PARAMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useSession } from "../(auth)/session-provider";
import UserAvatar from "../(auth)/user-avatar";

interface Props {
  inSideBar?: boolean;
  className?: string;
}

export function NavUser({ inSideBar = false, className }: Props) {
  const [isPending, startTransition] = useTransition();
  const { isMobile } = useSidebar();
  const { setTheme } = useTheme();

  const { user } = useSession();
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  newParams.set(
    REDIRECT_TO_URL_SEARCH_PARAMS,
    currentPathname + "?" + newParams.toString(),
  );
  const loginUrl = `/login` + "?" + newParams.toString();
  const userSettingUrl = getNavigationLinkWithPathnameWithoutUpdate(
    `/user/${user?.id}`,
  );

  return (
    <>
      {!user ? (
        <Link href={loginUrl}>
          <SidebarMenuButton className={className}>
            <LogInIcon />
            Login now
          </SidebarMenuButton>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "hover:bg-transparent  p-0 cursor-pointer",
                inSideBar
                  ? "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground "
                  : "max-w-fit rounded-full",
                className,
              )}
            >
              <UserAvatar avatarUrl={user.avatarUrl} />

              {inSideBar ? (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              ) : null}
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
            <DropdownMenuItem asChild>
              <Link
                href={userSettingUrl}
                onClick={() => startTransition(() => {})}
              >
                {isPending ? (
                  <Spinner className="mr-2 size-4" />
                ) : (
                  <Settings2Icon className="mr-2 size-4" />
                )}{" "}
                User settings
              </Link>
            </DropdownMenuItem>
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
            <DropdownMenuSeparator />
            <LogoutButton
              variant={"ghost"}
              className="flex justify-start  w-full"
            >
              <LogOutIcon className="mr-3 text-inherit inline-flex" />
              Sign out
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
