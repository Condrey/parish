"use client";

import { ThemeToggler } from "@/components/theme-toggler";
import { cn, siteConfig } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div
      className={cn(
        "bg-black  dark:bg-background text-muted-foreground tracking-wider py-0.5 capitalize w-full",
        className
      )}
    >
      <div className="w-full flex justify-between items-center max-w-9xl mx-auto">
        <p className='text-center text-sm md:after:content-["_,_The_Republic_Of_Uganda"]'>
          {`Copyright 2025${currentYear <= 2025 ? "" : `- ${currentYear}`},
            ${siteConfig.name}`}
        </p>
        <ThemeToggler />
      </div>
    </div>
  );
}
