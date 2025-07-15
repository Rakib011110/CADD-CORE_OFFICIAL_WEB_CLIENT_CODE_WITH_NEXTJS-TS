"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Eye, EyeOff } from "lucide-react"; // --- 1. Imported icons

import { useUserLogin } from "@/hooks/auth.hook";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import CaddForm from "@/components/resubaleform/CaddForm";
import CaddInput from "@/components/resubaleform/CaddInput";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";

const AnimationPlayer = dynamic(
  () => import("@/components/UI/AnimationPlayer/AnimationPlayer"),
  { ssr: false }
);

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectTo, setRedirectTo] = useState("/dashboard/manage-courses");
  const [showPassword, setShowPassword] = useState(false); // --- 2. Added state for password visibility
  const hasMounted = useHasMounted();

  const { mutate: handleUserLogin, isPending } = useUserLogin();

  useEffect(() => {
    const param = searchParams?.get("redirect");
    if (param) {
      setRedirectTo(param);
    }
  }, [searchParams]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleUserLogin(data, {
      onSuccess: (response: any) => {
        const role = response?.data?.role;
        if (role === "ADMIN") {
          router.push("/dashboard/manage-courses");
        } else {
          router.push("/user-profile");
        }
      },
      onError: (error) => {
        toast.error(error?.message || "Invalid email or password");
      },
    });
  };

  if (!hasMounted) return null;

  return (
    <section>
      {isPending && <LoadingSpinner />}

      <div className="h-screen w-full bg-gradient-to-br from-red-50 via-red-50 to-rose-70 flex items-center justify-center p-4">
        <div className="flex flex-col lg:flex-row w-full max-w-[1000px] bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/20">
          <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-red-500 to-rose-600 items-center justify-center p-8">
            <div className="text-white text-center">
              <AnimationPlayer />
              <h2 className="text-3xl font-bold mt-6">Join Our Community</h2>
              <p className="mt-2 opacity-90">
                Unlock exclusive features and content
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-8 sm:p-10">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-extrabold  bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600 uppercase">
                Welcome to Cadd Core
              </h3>
              <p className="text-gray-600 mt-2">
                Sign in to continue your journey
              </p>
            </div>

            <CaddForm onSubmit={onSubmit}>
              <div className="mb-6 space-y-4">
                <CaddInput
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                />

                {/* --- 3. Wrapped password input to add the icon --- */}
                <div className="relative">
                  <CaddInput
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 flex items-center text-gray-500 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                size="lg"
                type="submit"
              >
                {isPending ? "Signing in..." : "Login"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/90 text-gray-500">
                    No account yet?
                  </span>
                </div>
              </div>

              <Link href="/register" passHref>
                <Button
                  variant="outline"
                  className="w-full py-3 text-lg font-semibold text-rose-600 border-rose-600 rounded-lg hover:bg-rose-50 transition-all shadow-sm hover:shadow-md"
                  size="lg"
                >
                  REGISTER NOW
                </Button>
              </Link>

              <div className="mt-4 text-center text-sm">
                {/* <Link href="/forgot-password" className="text-rose-600 hover:text-rose-800 hover:underline">
                  Forgot password?
                </Link> */}
              </div>
            </CaddForm>
          </div>
        </div>
      </div>
    </section>
  );
}