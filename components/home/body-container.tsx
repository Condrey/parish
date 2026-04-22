import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import CustomBreadcrumbItem from "./custom-breadcrumb-item";

interface BodyContainerProps {
  children: React.ReactNode;
  breadCrumbs?: { title: string; href?: string }[] | undefined;
  className?: string;
}

export default function BodyContainer({
  breadCrumbs,
  children,
  className,
}: BodyContainerProps) {
  return (
    <>
      <header className="flex h-fit px-4 items-center  gap-2 ">
        <SidebarTrigger className="-ml-1 rotate-180" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadCrumbs?.map((item, index) => {
              return index + 1 != breadCrumbs.length ? (
                <CustomBreadcrumbItem
                  key={item.title}
                  item={item}
                  index={index}
                />
              ) : (
                <BreadcrumbPage key={item.title}>{item.title}</BreadcrumbPage>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div
        className={cn(
          "px-4  max-w-9xl h-full  mx-auto w-full  min-h-[75vh] ",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
