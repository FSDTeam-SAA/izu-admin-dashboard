"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Pencil, Camera } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCard } from "./profile-card";
import { updateProfile } from "@/lib/api";
import { getErrorMessage } from "@/lib/axios";
import type { Profile } from "@/lib/types";

interface PersonalInfoProps {
  profile?: Profile;
  isLoading: boolean;
}

interface FormState {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

const emptyForm: FormState = {
  name: "",
  lastName: "",
  email: "",
  phone: "",
  bio: "",
};

export function PersonalInfo({ profile, isLoading }: PersonalInfoProps) {
  const queryClient = useQueryClient();
  const { update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        bio: profile.bio ?? "",
      });
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("lastName", form.lastName);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("bio", form.bio);
      if (imageFile) fd.append("profileImage", imageFile);
      return updateProfile(fd);
    },
    onSuccess: async (updated) => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      await update({
        user: {
          name: updated?.name,
          lastName: updated?.lastName,
          email: updated?.email,
          phone: updated?.phone,
          bio: updated?.bio,
          image: updated?.profileImage,
        },
      });
      setEditing(false);
      setImageFile(null);
      setPreview(null);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleCancel() {
    setEditing(false);
    setImageFile(null);
    setPreview(null);
    if (profile) {
      setForm({
        name: profile.name ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        bio: profile.bio ?? "",
      });
    }
  }

  return (
    <div className="space-y-5">
      {/* Profile summary + avatar edit */}
      <div className="relative">
        <ProfileCard
          profile={profile}
          isLoading={isLoading}
          previewImage={preview}
        />
        {editing && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute left-[88px] top-[68px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow"
            aria-label="Change photo"
          >
            <Camera className="h-4 w-4" />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <div className="absolute right-5 top-5">
          {!editing && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setEditing(true)}
              disabled={isLoading}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Personal information form */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold">Personal Information</h3>
          {editing && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={!editing}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                disabled={!editing}
                placeholder="Last name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={!editing}
                placeholder="Email address"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={!editing}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={!editing}
                rows={4}
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
