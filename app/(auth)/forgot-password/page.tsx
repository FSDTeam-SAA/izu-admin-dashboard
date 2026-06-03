"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/api";
import { getErrorMessage } from "@/lib/axios";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => {
      toast.success("OTP sent to your email");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-center text-2xl font-bold sm:text-3xl">
        Forgot Password
      </h1>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 pl-11"
          autoComplete="email"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Sending..." : "Send OTP"}
      </Button>
    </form>
  );
}
