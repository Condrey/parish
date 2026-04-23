import { getAllParishes } from "@/components/project/parish/action";
import { TypographyH1 } from "@/components/project/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { CoinsIcon, HeartIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import PageClient from "./page-client";

export default function Home() {
  return (
    <div className="px-3 flex flex-col h-dvh overflow-y-auto    justify-center items-center space-y-6">
      <TypographyH1 className="mt-12">
        <CoinsIcon className="inline size-12 mr-2 fill-secondary/50" />
        PDM BENEFICIARY LIST
      </TypographyH1>
      <div className="flex flex-col flex-1   justify-center items-center">
        <LoadingData />
      </div>
      <h6 className="text-center inline *:inline mb-12">
        Made with{" "}
        <HeartIcon className="fill-red-600 inline text-red-600 animate-pulse" />{" "}
        By <Link href={'mailto:coundreyjames@gmail.com'} className="underline hover:text-blue-500">IT Officer, Lira City</Link>
      </h6>
    </div>
  );
}

const LoadingData = async () => {
  const parishes = await getAllParishes();
  return (
    <Suspense fallback={<FallBack />}>
      <PageClient parishes={parishes} />
    </Suspense>
  );
};
const FallBack = async () => (
  <div className="space-y-3 animate-pulse w-full max-w-md">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-9 w-full" />
  </div>
);
