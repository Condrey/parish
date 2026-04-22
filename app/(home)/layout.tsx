import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateRequest } from "../(auth)/auth";
import SessionProvider from "../(auth)/session-provider";
import Footer from "../footer";
import { AppSidebar } from "./app-sidebar";
import TopAppBar from "./top-app-bar";

export const iframeHeight = "800px";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }
  if (user && !user.isVerified) {
    console.log(
      "redirecting to user verification because they are not yet verified",
      { user },
    );
    redirect(`/user-verification/${user.id}`);
  }
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value;

  const defaultOpen = sidebarState === "true";
  return (
    <SessionProvider value={{ session, user }}>
      <div className="[--header-height:calc(--spacing(14))]">
        {/* <pre>{JSON.stringify({ cookieStore, open }, null, 2)}</pre> */}
        <SidebarProvider defaultOpen={defaultOpen} className="flex flex-col ">
          <header className="sticky top-0 z-50 h-(--header-height)  flex items-center w-full  bg-accent text-accent-foreground border-b shadow-xl  dark:border-b">
            <TopAppBar className="w-full md:max-w-9/12    py-2 mx-auto  px-3  " />
          </header>
          <div className="flex   flex-1 size-full ">
            <AppSidebar />
            <SidebarInset className="  ">
              <div className=" mx-auto h-full  overflow-hidden flex flex-col  w-full">
                <main className=" flex-1 w-full overflow-x-hidden    flex flex-col gap-4 ">
                  {children}
                  <footer className="w-full  hidden md:block">
                    <Footer className="bg-black/80 dark:bg-white/20 *:px-4 w-full  text-background dark:text-foreground " />
                  </footer>
                </main>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </SessionProvider>
  );
}
