"use client";

import React from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useUserRegistration } from "@/hooks/auth.hook";
import CaddForm from "@/components/resubaleform/CaddForm";
import CaddInput from "@/components/resubaleform/CaddInput";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { mutate: handleUserRegistration, isPending } = useUserRegistration();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const userData = {
      ...data,
      profilePhoto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    };

    localStorage.setItem('emailForVerification', data.email);
    
    handleUserRegistration(userData, {
      onSuccess: () => {
        toast.success("রেজিস্ট্রেশন সফল! আপনার ইমেইল যাচাই করুন।", {
          duration: 5000,
        });
        // Store success message for email verification
        localStorage.setItem('registrationSuccess', 'true');
        onSuccess?.();
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message;
        toast.error(
          message?.toLowerCase().includes('duplicate')
            ? 'ইমেইল ইতিমধ্যে ব্যবহৃত হয়েছে। অন্য ইমেইল ব্যবহার করুন।'
            : message || 'রেজিস্ট্রেশনে সমস্যা হয়েছে।'
        );
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">রেজিস্টার করুন</h3>
        <p className="text-gray-600 mt-2">নতুন অ্যাকাউন্ট তৈরি করুন</p>
      </div>

      <CaddForm onSubmit={onSubmit}>
        <div className="space-y-4">
          <CaddInput
            label="নাম"
            name="name"
            placeholder="আপনার নাম লিখুন"
            required
          />
          
          <CaddInput
            label="ইমেইল"
            name="email"
            placeholder="আপনার ইমেইল লিখুন"
            type="email"
            required
          />
          
          <CaddInput
            label="মোবাইল নম্বর"
            name="mobileNumber"
            placeholder="আপনার মোবাইল নম্বর লিখুন"
            required
          />
          
          <CaddInput
            label="পাসওয়ার্ড"
            name="password"
            placeholder="আপনার পাসওয়ার্ড লিখুন"
            type="password"
            required
          />

          <Button
            className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "রেজিস্টার হচ্ছে..." : "রেজিস্টার করুন"}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              রেজিস্ট্রেশনের পর আপনার ইমেইল যাচাই করতে হবে
            </p>
          </div>
        </div>
      </CaddForm>
    </div>
  );
}
