"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserRegistration } from "@/hooks/auth.hook";
import CaddForm from "@/components/resubaleform/CaddForm";
import { Button } from "@/components/UI/button";
import CaddInput from "@/components/resubaleform/CaddInput";
import { motion } from "framer-motion";

export type USER_ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  HR: 'HR',
  MARKETING_TEAM: 'MARKETING_TEAM',
  CUSTOMER_SERVICE_TEAM: 'CUSTOMER_SERVICE_TEAM',
};
import { FormProvider,  } from "react-hook-form";

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");

  const router = useRouter();

  const methods = useForm<FieldValues>();  // 👈 create form methods
  const { handleSubmit, control } = methods;

  const {
    mutate: handleUserRegistration,
    isSuccess,
    isPending,
  } = useUserRegistration();

  useEffect(() => {
    if (!isPending && isSuccess) {
      router.push(redirect || "/dashboard/register");
    }
  }, [isPending, isSuccess, redirect, router]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const userData = {
      ...data,
      profilePhoto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    };
    handleUserRegistration(userData);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 min-h-screen flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="shadow-2xl rounded-2xl p-8 bg-white w-full max-w-md"
      >
        <h3 className="text-3xl font-extrabold text-center text-indigo-700 mb-4">
        CADD CORE – Knowledge to Design❤️ 

        </h3>
        <p className="text-center text-gray-600 mb-8">
          Create your account and get started!
        </p>

        <CaddForm onSubmit={handleSubmit(onSubmit)}>
          <FormProvider {...methods}>
            <div className="grid grid-cols-1 gap-5">
              <CaddInput
                label="Name"
                name="name"
                placeholder="Enter your name"
                size="sm"
              />
              <CaddInput
                label="Email"
                name="email"
                placeholder="Enter your email"
                size="sm"
              />
              <CaddInput
                label="Mobile Number"
                name="mobileNumber"
                placeholder="Enter your mobile number"
                size="sm"
              />
              <CaddInput
                label="Password"
                name="password"
                placeholder="Enter your password"
                size="sm"
                type="password"
              />

              {/* Role Dropdown with Controller */}
              {/* <div>
                <label className="block mb-1">Role</label>
                <select
                  name="role"
                  
                  className="w-full border px-3 py-2 rounded"
                > 


                  <option value="ADMIN">ADMIN</option>
                  <option value="HR">HR</option>
                  <option value="CUSTOMER_SERVICE_TEAM">MARKETING TEAM</option>
                  <option value="CUSTOMER_SERVICE_TEAM">CUSTOMER_SERVICE_TEAM</option>
                </select>
              </div> */}

              <Button
                className="mt-4 w-full rounded-md bg-indigo-600 text-white font-semibold text-lg py-2 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none"
                size="lg"
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Registering..." : "Register"}
              </Button>
            </div>
          </FormProvider>
        </CaddForm>

        {/* <div className="text-center mt-6">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <Link
            className="text-indigo-600 font-semibold hover:underline"
            href="/login"
          >
            Login
          </Link>
        </div> */}
      </motion.div>
    </div>
  );
};

export default RegisterPage;
