"use client";

import { cn } from "@/lib/utils";
import { LucideIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const toggleThemes: { name: string; theme: string; icon: LucideIcon }[] = [
  { name: "Light", theme: "light", icon: SunIcon },
  { name: "Dark", theme: "dark", icon: MoonIcon },
  { name: "System", theme: "system", icon: MonitorIcon },
];

export function ThemeToggler({ className }: { className?: string }) {
  const { setTheme, theme: currentTheme, resolvedTheme } = useTheme();

  return (
    <div className={cn("flex ", className)}>
      {toggleThemes.map(({ name, theme, icon }) => {
        const Icon = icon;
        return (
          <Button
            key={name}
            variant={currentTheme === theme ? "secondary" : "ghost"}
            size={"icon"}
            onClick={() => setTheme(theme)}
            title={name + " mode"}
          >
            <Icon suppressHydrationWarning />
            <span className="sr-only">{name} theme mode</span>
          </Button>
        );
      })}
    </div>
  );
}
