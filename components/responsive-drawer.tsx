import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Button } from "./ui/button";

interface ResponsiveDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  description?: string;
  className?: string;
  modal?: boolean;
}

export default function ResponsiveDrawer({
  open,
  setOpen,
  title,
  children,
  description,
  className,
  modal = true,
}: ResponsiveDrawerProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile ? (
        <Dialog open={open} onOpenChange={setOpen} modal={modal}>
          <DialogContent
            className={cn(
              "h-auto max-h-dvh overflow-y-auto scroll-smooth sm:max-w-4xl",
              className
            )}
          >
            <DialogHeader className="">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="whitespace-pre-line">
                {description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 ">{children}</div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen} modal={modal}>
          <DrawerContent className={cn("mt-6 max-h-dvh ", className)}>
            <div className="flex w-full items-start justify-between gap-2 pe-4">
              <DrawerHeader className="text-left">
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription className="whitespace-pre-line">
                  {description}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerClose asChild>
                <Button variant="outline" className="size-6 rounded-full p-0">
                  <XIcon className="size-4" />
                </Button>
              </DrawerClose>
            </div>
            <div className="flex w-full flex-col gap-4 overflow-y-auto scroll-smooth bg-background/10 px-4 pt-6">
              {children}
            </div>
            <DrawerFooter className="pt-2"></DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
