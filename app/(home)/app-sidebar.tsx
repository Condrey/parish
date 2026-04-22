"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import { NavLink, NavLinkGroup, privilegeLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronRight, Loader2Icon, MoveUpRightIcon } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { useSession } from "../(auth)/session-provider";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open: isOpen } = useSidebar();
  const { user } = useSession();
  if (!user) redirect("/login");
  const { navLinks } = privilegeLinks[user.role];
  return (
    <Sidebar
      className="top-(--header-height)  h-[calc(100svh-var(--header-height))]! not-only:bg-primary"
      collapsible="icon"
      {...props}
    >
      {/* <SidebarHeader className=" p-0">
        <SidebarMenu className="">
          <SidebarMenuItem>
            <SidebarMenuButton className="flex flex-col  w-full  h-fit  data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground">
              <div className="flex flex-col items-center aspect-square size-full max-h-40 ">
                <Image
                  src={"/logo.png"}
                  alt="logo"
                  width={150}
                  height={150}
                  className="bg-cover size-full"
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent className={cn(isOpen && "px-0")}>
        <SidebarGroup className={cn(isOpen && "px-0")}>
          <SidebarGroupLabel>Navigation Menu </SidebarGroupLabel>
          <SidebarMenu>
            {navLinks.map((item, index) => (
              <ParentMenuItem key={item.href} item={item} index={index} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser inSideBar />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function ParentMenuItem({
  item,
  index,
}: {
  item: NavLinkGroup;
  index: number;
}) {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { open: isOpen, isMobile, setOpen } = useSidebar();

  const ItemIcon = item.icon!;
  const isActive = item.children.some((i) => pathname.startsWith(i.href));
  const noDropDown = index === 0 || !item.children.length;
  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const [openCollapsible, setOpenCollapsible] = useState(isActive);

  const url = noDropDown
    ? getNavigationLinkWithPathnameWithoutUpdate(item.href)
    : "#";
  const iconClassName = cn(
    " [&svg]:size-5.5   group-hover/parent-link:text-sidebar-accent-foreground",
    isActive ? "" : "text-sidebar-accent",
    !isOpen && "ms-1",
  );

  return (
    <>
      <Collapsible
        key={item.title}
        defaultOpen={openCollapsible}
        onOpenChange={setOpenCollapsible}
        className="group/collapsible"
        asChild
      >
        <SidebarMenuItem
          className={cn(
            openCollapsible &&
              "inset-shadow-sm shadow-sm ring ring-sidebar-accent/20 bg-sidebar-accent/25",
          )}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              size={"lg"}
              onClick={() =>
                startTransition(() => {
                  if (noDropDown) {
                    setOpenMobile(false);
                  } else {
                    // to un-collapse sidebar upon clicking a button
                    if (!isMobile && !isOpen) {
                      setOpen(true);
                    }
                  }
                })
              }
              className={cn("group/parent-link")}
              asChild
            >
              <Link href={url}>
                {item.icon && (
                  <>
                    {isPending ? (
                      <Spinner className={iconClassName} />
                    ) : (
                      <ItemIcon className={iconClassName} />
                    )}
                  </>
                )}
                <span
                  className={cn("line-clamp-1 text-ellipsis wrap-break-word")}
                >
                  {item.title}
                </span>
                {!noDropDown ? (
                  <ChevronRight
                    className={
                      "ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    }
                  />
                ) : (
                  <MoveUpRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                )}
              </Link>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {item.children?.length ? (
            <CollapsibleContent className={cn(" *:space-y-2 ")}>
              <SidebarMenuSub className="block ">
                {item.children.map((i) => (
                  <MenuItem parentLink={item.href} item={i} key={i.href} />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          ) : (
            <></>
          )}
        </SidebarMenuItem>
      </Collapsible>
    </>
  );
}

function MenuItem({ item, parentLink }: { item: NavLink; parentLink: string }) {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const isActive = pathname.startsWith(item.href) && pathname !== "/";

  const { getNavigationLinkWithPathnameWithoutUpdate } =
    useCustomSearchParams();
  const url = getNavigationLinkWithPathnameWithoutUpdate(item.href);
  return (
    <SidebarMenuSubItem key={item.title} className="">
      <SidebarMenuSubButton
        title={item.description}
        onClick={() =>
          startTransition(() => {
            setOpenMobile(false);
          })
        }
        asChild
        isActive={isActive}
        size="lg"
      >
        <Link href={url} className="h-fit py-1 flex gap-2">
          {isPending && <Loader2Icon className="animate-spin size-4" />}
          {item.title}
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
