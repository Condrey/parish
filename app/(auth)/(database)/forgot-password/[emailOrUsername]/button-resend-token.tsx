import LoadingButton from "@/components/ui/loading-button";
import { PasswordResetSchema } from "@/lib/validation";
import { addSeconds, intervalToDuration, isBefore } from "date-fns";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { validateEmail } from "./action";

const BASE_DELAY = 60; // seconds
const MAX_ATTEMPTS = 5;
const getDelay = (attempt: number) => {
  return BASE_DELAY * Math.pow(2, attempt - 1);
};

interface Props {
  form: UseFormReturn<PasswordResetSchema>;
}
export default function ButtonResendToken({ form }: Props) {
  const [, forceUpdate] = useState(0);
  const [attempts, setAttempts] = useState(() => {
    if (typeof window === "undefined") return 1;

    const saved = localStorage.getItem("attempts");
    if (!saved) return 1;

    const _attempts = Number(saved);

    if (isNaN(_attempts) || _attempts < 1) {
      localStorage.removeItem("attempts");
      return 1;
    }
    return _attempts;
  });

  const [resendExpiry, setResendExpiry] = useState<Date | null>(() => {
    if (typeof window === "undefined") return null;

    const saved = localStorage.getItem("resendExpiry");
    if (!saved) return null;

    const expiry = new Date(saved);

    if (isNaN(expiry.getTime()) || expiry <= new Date()) {
      localStorage.removeItem("resendExpiry");
      return null;
    }

    return expiry;
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((x) => x + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResend = () => {
    if (resendExpiry && new Date() < resendExpiry) return;
    if (attempts >= MAX_ATTEMPTS) {
      toast.error("Maximum resend attempts reached");
      return;
    }

    const nextAttempts = attempts + 1;
    const delay = getDelay(nextAttempts);
    const addedSeconds = addSeconds(new Date(), delay);
    localStorage.setItem("resendExpiry", addedSeconds.toISOString());
    localStorage.setItem("attempts", String(nextAttempts));
    setAttempts(nextAttempts);
    setResendExpiry(addedSeconds);

    startTransition(async () => {
      const { error } = await validateEmail({ input: form.watch() });
      if (error) {
        toast.error(error);
      } else {
        toast.success("OTP resent successfully");
      }
    });
  };
  const now = new Date();

  const timeLeft =
    resendExpiry && isBefore(now, resendExpiry)
      ? intervalToDuration({ start: now, end: resendExpiry })
      : null;
  const formatTimeLeft = () => {
    if (!timeLeft) return null;

    const minutes = String(timeLeft.minutes ?? 0).padStart(2, "0");
    const seconds = String(timeLeft.seconds ?? 0).padStart(2, "0");

    return `${minutes}:${seconds}`;
  };
  return (
    <LoadingButton
      type="submit"
      variant="link"
      size="lg"
      value="step-1"
      name="action"
      disabled={!!resendExpiry && new Date() < resendExpiry}
      loading={isPending}
      onClick={handleResend}
    >
      <RefreshCwIcon className="inline mr-2" />
      {resendExpiry && new Date() < resendExpiry
        ? `Retry in ${formatTimeLeft()}`
        : "Resend Code"}
    </LoadingButton>
  );
}
