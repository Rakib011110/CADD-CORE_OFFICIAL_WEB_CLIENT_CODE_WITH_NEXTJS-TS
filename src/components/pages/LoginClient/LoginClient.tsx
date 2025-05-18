"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

import { useUserLogin } from "@/hooks/auth.hook";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import CaddForm from "@/components/resubaleform/CaddForm";
import CaddInput from "@/components/resubaleform/CaddInput";
import { Button } from "@/components/UI/button";

// Ensure AnimationPlayer is client-only
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
  const hasMounted = useHasMounted();

  const { mutate: handleUserLogin, isPending, isSuccess } = useUserLogin();

  useEffect(() => {
    const param = searchParams?.get("redirect");
    if (param) {
      setRedirectTo(param);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isSuccess) {
      router.push(redirectTo);
    }
  }, [isSuccess, redirectTo, router]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleUserLogin(data);
  };

  // Render nothing until after mount to avoid SSR mismatches
  if (!hasMounted) {
    return null;
  }

  return (
    <section>
      {isPending && <LoadingSpinner />}

      <div className="h-screen w-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex items-center justify-center">
        <div className="flex flex-col lg:flex-row w-[90%] max-w-[900px] bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="hidden lg:flex w-full lg:w-1/2 bg-blue-100 items-center justify-center p-6">
            <AnimationPlayer />
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full lg:w-1/2 p-8">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6">
              Welcome to Cadd core
            </h3>

            <p className="text-gray-600 text-center mb-6 text-sm sm:text-base">
              Sign in to continue
            </p>




            <CaddForm onSubmit={onSubmit}>
              <div className="mb-6">
                <CaddInput
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div className="mb-6">
                <CaddInput
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                />
              </div>
              <Button
                className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-shadow shadow-md hover:shadow-lg"
                size="lg"
                type="submit"
              >
                Login
              </Button> 

            </CaddForm>


            {/* <div className="text-center mt-6 text-sm">
              <span className="text-gray-600">Do not have an account?</span>{" "}
              <Link
                className="text-blue-600 font-semibold hover:underline"
                href="/register-customer"
              >
                Register
              </Link>
            </div>
            <div className="text-center mt-4 text-sm">
              <span className="text-gray-600">Forgot Password?</span>{" "}
              <Link
                className="text-blue-600 font-semibold hover:underline"
                href="/forgot-pass"
              >
                Reset
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
