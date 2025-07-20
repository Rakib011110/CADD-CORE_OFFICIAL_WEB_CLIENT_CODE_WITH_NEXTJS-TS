"use client";

import React, { useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useUserLogin } from "@/hooks/auth.hook";
import CaddForm from "@/components/resubaleform/CaddForm";
import CaddInput from "@/components/resubaleform/CaddInput";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: handleUserLogin, isPending } = useUserLogin();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleUserLogin(data, {
      onSuccess: () => {
        toast.success("সফলভাবে লগইন হয়েছে!");
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error?.message || "ইমেইল বা পাসওয়ার্ড ভুল");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">লগইন করুন</h3>
        <p className="text-gray-600 mt-2">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
      </div>

      <CaddForm onSubmit={onSubmit}>
        <div className="space-y-4">
          <CaddInput
            label="ইমেইল"
            name="email"
            placeholder="আপনার ইমেইল লিখুন"
            type="email"
            required
          />

          <div className="relative">
            <CaddInput
              label="পাসওয়ার্ড"
              name="password"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              type={showPassword ? "text" : "password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 flex items-center text-gray-500 cursor-pointer"
              aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <Button
            className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "লগইন হচ্ছে..." : "লগইন করুন"}
          </Button>
        </div>
      </CaddForm>
    </div>
  );
}
