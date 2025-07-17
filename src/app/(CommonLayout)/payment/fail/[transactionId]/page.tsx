// app/payment/fail/[transactionId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useGetPaymentStatusQuery } from "@/redux/api/payment/paymentStatusApi";

interface PaymentStatus {
  success: boolean;
  transaction: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    courseId: string;
    userId: string;
    gateway: string;
    paymentDate: string;
  };
}

export default function FailedPaymentTransaction() {
  const [isValid, setIsValid] = useState(false);
  const params = useParams();
  
  // Get transaction ID safely
  const transactionId = Array.isArray(params.transactionId)
    ? params.transactionId[0]
    : params.transactionId;

  // Query payment status
  const { data: paymentData, isLoading, error } = useGetPaymentStatusQuery(
    transactionId as any,
    { skip: !transactionId }
  );

  useEffect(() => {
    if (!transactionId) {
      toast.error("Invalid transaction ID");
      return;
    }

    // Validate transaction ID format
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      transactionId
    );

    if (!isValidUUID) {
      toast.error("Invalid transaction format");
      return;
    }

    setIsValid(true);
  }, [transactionId]);

  useEffect(() => {
    if (paymentData && paymentData.success) {
      if (paymentData.transaction.status === "completed") {
        toast.success("Payment was actually successful! Redirecting...");
        // Redirect to success page if payment was actually successful
        window.location.href = `/payment/success/${transactionId}`;
      } else {
        toast.error("Payment failed");
      }
    } else if (error) {
      toast.error("Unable to verify payment status");
    }
  }, [paymentData, error, transactionId]);

  if (!isValid || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-gray-300">
              {isLoading ? "Verifying payment..." : "Validating payment..."}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-red-600">Payment Failed</h1>
        <p className="mb-6 text-gray-600">Unfortunately, your payment could not be processed.</p>
        
        {paymentData && paymentData.transaction && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold mb-2">Transaction Details:</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Amount:</span> {paymentData.transaction.amount} {paymentData.transaction.currency}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Status:</span> {paymentData.transaction.status}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Gateway:</span> {paymentData.transaction.gateway}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Date:</span> {new Date(paymentData.transaction.paymentDate).toLocaleDateString()}
            </p>
          </div>
        )}
        
        <p className="mb-4 text-sm text-gray-600">
          Transaction ID: {transactionId}
        </p>
        
        <div className="space-y-2">
          <Link href="/courses" className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Try Again
          </Link>
          <Link href="/student-corner" className="block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Contact Support
          </Link>
          <Link href="/" className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}