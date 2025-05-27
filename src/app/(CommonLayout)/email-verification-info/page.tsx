"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('emailForVerification');
    if (storedEmail) setEmail(storedEmail);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-50 to-rose-100">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20 text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600">
            Please Check Your Email
          </h2>
          
          <svg
            className="mx-auto h-16 w-16 text-rose-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>

          <div className="space-y-2">
            <p className="text-gray-700">
              We've sent a verification link to
            </p>
            <p className="font-semibold text-rose-600 text-lg">{email}</p>
            <p className="text-gray-600 text-sm">
              Click the link in the email to verify your account.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/login" passHref>
            <button className="w-full py-3 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl">
              Continue to Login
            </button>
          </Link>

          <p className="text-sm text-gray-500">
            Already verified? <Link href="/login" className="text-rose-600 hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}