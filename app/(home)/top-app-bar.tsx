"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn, siteConfig, webName } from "@/lib/utils";
import {} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { NavUser } from "./nav-user";

interface TopAppBarProps {
  className?: string;
}

export default function TopAppBar({ className }: TopAppBarProps) {
  return (
    <header
      className={cn("flex justify-between w-full  items-center", className)}
    >
      <div className="flex items-center">
        <Image src={"/logo.png"} alt="logo" height={50} width={50} />
        <p className="uppercase ms-2 text-xl md:text-2xl w-full line-clamp-1  flex-1 items-center inline ">
          <span className="md:hidden">{webName}</span>
          <span className="hidden md:inline">{siteConfig.name}</span>
        </p>
      </div>
      <NavUser className={"hidden md:flex"} />
      <SidebarTrigger
        className="md:hidden"
        size={"xl"}
        variant={"destructive"}
      />
    </header>
  );
}
