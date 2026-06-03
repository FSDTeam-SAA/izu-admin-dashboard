"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileCard } from "./profile-card";
import { changePassword } from "@/lib/api";
import { getErrorMessage } from "@/lib/axios";
import type { Profile } from "@/lib/types";

interface ChangePasswordProps {
  profile?: Profile;
  isLoading: boolean;
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function PasswordField({ label, value, onChange }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••••••"
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-label="Toggle visibility"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export function ChangePassword({ profile, isLoading }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      changePassword({ currentPassword, newPassword, confirmPassword }),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="space-y-5">
      <ProfileCard profile={profile} isLoading={isLoading} />

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        <h3 className="mb-5 text-lg font-bold">Change password</h3>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
