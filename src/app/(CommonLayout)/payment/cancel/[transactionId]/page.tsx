// app/payment/cancel/[transactionId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useGetPaymentStatusQuery } from "@/redux/api/payment/paymentStatusApi";

export default function PaymentCancelPage() {
  const [isValid, setIsValid] = useState(false);
  const params = useParams();
  
  const transactionId = Array.isArray(params.transactionId)
    ? params.transactionId[0]
    : params.transactionId;

  const { data: paymentData, isLoading, error } = useGetPaymentStatusQuery(
    transactionId ?? "",
    { skip: !transactionId }
  );

  useEffect(() => {
    if (!transactionId) {
      toast.error("Invalid transaction ID");
      return;
    } 
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      transactionId
    );
    if (!isValidUUID) {
      toast.error("Invalid transaction format");
      return;
    }
    setIsValid(true);
    toast.warning("Payment was canceled.");
  }, [transactionId]);

  if (!isValid || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-gray-300">
              {isLoading ? "Verifying cancellation..." : "Validating..."}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="text-yellow-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-yellow-600">Payment Canceled</h1>
        <p className="mb-6 text-gray-600">Your payment process was canceled. You have not been charged.</p>
        
        {paymentData && paymentData.transaction && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold mb-2">Transaction Details:</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Status:</span> {paymentData.transaction.status}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Transaction ID:</span> {transactionId}
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <Link href="/courses" className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Browse Courses
          </Link>
          <Link href="/" className="block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
