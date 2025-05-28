'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm, Controller, FormProvider } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserRegistration } from '@/hooks/auth.hook';
import CaddForm from '@/components/resubaleform/CaddForm';
import { Button } from '@/components/UI/button';
import CaddInput from '@/components/resubaleform/CaddInput';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
// all updateed
export type USER_ROLE = {
  ADMIN: 'ADMIN';
  USER: 'USER';
  HR: 'HR';
  MARKETING_TEAM: 'MARKETING_TEAM';
  CUSTOMER_SERVICE_TEAM: 'CUSTOMER_SERVICE_TEAM';
};

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');
  const router = useRouter();

  const methods = useForm<FieldValues>();
  const { handleSubmit } = methods;

  const {
    mutate: handleUserRegistration,
    isSuccess,
    isPending,
    isError,
    error,
  } = useUserRegistration();

  useEffect(() => {
    if (!isPending && isSuccess) {
      toast.success('Registration successful! Please check your email to verify your account.', {
        duration: 5000,
        position: 'top-center',
      });

      // Redirect to verify info page (optional)
      router.push('/email-verification-info');
    }

    if (
      !isPending &&
      isError &&
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      (error as any).response?.data?.message
    ) {
      const message = (error as any).response.data.message;
      toast.error(
        message.toLowerCase().includes('duplicate')
          ? 'Email is already in use. Try logging in or use another email.'
          : message
      );
    }
  }, [isSuccess, isPending, isError, error, router]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const userData = {
      ...data,
      profilePhoto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    };

    localStorage.setItem('emailForVerification', data.email); // For resend feature
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
              <CaddInput label="Name" name="name" placeholder="Enter your name" size="sm" />
              <CaddInput label="Email" name="email" placeholder="Enter your email" size="sm" />
              <CaddInput label="Mobile Number" name="mobileNumber" placeholder="Enter your mobile number" size="sm" />
              <CaddInput label="Password" name="password" placeholder="Enter your password" size="sm" type="password" />

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
      </motion.div>
    </div>
  );
};

export default RegisterPage;
