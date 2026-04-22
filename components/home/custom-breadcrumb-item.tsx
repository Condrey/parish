"use client";

import { useCustomSearchParams } from "@/hooks/use-custom-search-param";
import Link from "next/link";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface CustomBreadcrumbItemProps {
  item: { title: string; href?: string };
  index: number;
}
export default function CustomBreadcrumbItem({
  item,
  index,
}: CustomBreadcrumbItemProps) {
  const { getNavigationLinkWithoutUpdate } = useCustomSearchParams();
  const newHref = getNavigationLinkWithoutUpdate(item.href || "/");
  return (
    <div className="flex items-center">
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={newHref}>{item.title}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </div>
  );
}
