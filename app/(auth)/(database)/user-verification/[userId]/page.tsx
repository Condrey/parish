import prisma from "@/lib/prisma";
import VerificationForm from "./verification-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { webName } from "@/lib/utils";

interface PageProps {
  params: Promise<{ userId: string }>;
}
export default async function Page({ params }: PageProps) {
  const { userId } = await params;
  console.log(userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  return (
    <div className="flex h-dvh w-full flex-col justify-center p-4">
      <Card className="mx-auto h-fit w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Please complete the registration process to continue.
          </CardTitle>
          <CardDescription>Change these values as you wish</CardDescription>
        </CardHeader>
        <CardContent>
          <VerificationForm user={user} />
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          <Checkbox checked disabled className="mr-2" />{" "}
          <p>
            By continuing, you agree to the terms and conditions of{" "}
            <span className="font-semibold italic">{webName}</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
