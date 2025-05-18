"use client";
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';


function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setError('Invalid verification link - no token provided');
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-email`,
          { token },
          { timeout: 10000 }
        );

        if (response.status === 200) {
          setStatus('success');
          toast.success('Email verified successfully!');
          localStorage.removeItem('emailForVerification');
        } else {
          setStatus('error');
          setError(response.data?.message || 'Verification failed. Please try again.');
        }
      } catch (error: any) {
        setStatus('error');
        if (error.response) {
          setError(error.response.data?.message || 'Verification failed. Please try again.');
        } else if (error.request) {
          setError('Network error. Please check your connection and try again.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [token]);

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      const email = localStorage.getItem('emailForVerification');
      if (!email) {
        setError('No email found for verification. Please register again.');
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-verification`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      toast.success('Verification email resent successfully!');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to resend verification email.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      {/* full render UI same as before */}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
