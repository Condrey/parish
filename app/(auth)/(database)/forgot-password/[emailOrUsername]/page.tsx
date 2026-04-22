/* eslint-disable @typescript-eslint/no-explicit-any */
import FormRequestReset from "./form-request-reset";

interface PageProps {
  params: Promise<{
    emailOrUsername: string | undefined;
  }>;
  searchParams: Promise<any>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { emailOrUsername: encodedEmailOrUsername } = await params;
  const isValidEmail = (await searchParams)["isValidEmail"];
  const emailOrUsername = decodeURIComponent(encodedEmailOrUsername!);

  return (
    <div className="max-w-5xl mx-auto py-6 flex flex-col h-dvh overflow-y-auto items-center px-3">
      <h1>Forgot Password for {emailOrUsername}</h1>
      <div className="flex-1 size-full flex flex-col justify-center items-center">
        {/* <pre>{JSON.stringify({ encodedEmailOrUsername }, null, 2)}</pre> */}
        <div className="w-full">
          <FormRequestReset
            emailUsername={emailOrUsername}
            isValidEmail={!!isValidEmail}
          />
        </div>
      </div>
    </div>
  );
}
