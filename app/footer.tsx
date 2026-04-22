"use client";

import { ThemeToggler } from "@/components/theme-toggler";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, organization, siteConfig, webName } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "bg-black  dark:bg-background text-muted-foreground tracking-wider py-0.5 capitalize w-full",
        className,
      )}
    >
      <div className="w-full flex justify-between items-center max-w-9xl mx-auto">
        <p className='text-center text-sm xl:after:content-["_,_The_Republic_Of_Uganda"] line-clamp-1'>
          {`Copyright 2025${currentYear <= 2025 ? "" : `- ${currentYear}`},
            ${isMobile ? webName : siteConfig.name}`}{" "}
          {isMobile ? "" : organization}
        </p>
        <ThemeToggler className="flex-none" />
      </div>
    </div>
  );
}
