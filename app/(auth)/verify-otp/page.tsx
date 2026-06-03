"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forgotPassword, verifyOtp } from "@/lib/api";
import { getErrorMessage } from "@/lib/axios";

const OTP_LENGTH = 6;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [digits, setDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const otp = digits.join("");

  const verifyMutation = useMutation({
    mutationFn: () => verifyOtp({ email, otp }),
    onSuccess: () => {
      toast.success("OTP verified successfully");
      router.push(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`
      );
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const resendMutation = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => toast.success("A new OTP has been sent"),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  function handleChange(index: number, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => (next[i] = c));
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Missing email. Please restart the reset flow.");
      router.push("/forgot-password");
      return;
    }
    if (otp.length !== OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    verifyMutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-center text-2xl font-bold sm:text-3xl">Enter OTP</h1>

      <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              "h-14 w-12 rounded-lg border border-input text-center text-2xl font-semibold transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring sm:h-16 sm:w-14"
            )}
          />
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t Receive OTP?{" "}
        <button
          type="button"
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending}
          className="font-medium text-primary hover:underline disabled:opacity-60"
        >
          RESEND OTP
        </button>
      </p>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={verifyMutation.isPending}
      >
        {verifyMutation.isPending ? "Verifying..." : "Verify"}
      </Button>
    </form>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
