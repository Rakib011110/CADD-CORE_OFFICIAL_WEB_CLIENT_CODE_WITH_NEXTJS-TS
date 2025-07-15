// app/payment/success/[transactionId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const [isValid, setIsValid] = useState(false);
  const params = useParams();
  
  // Get transaction ID safely
  const transactionId = Array.isArray(params.transactionId)
    ? params.transactionId[0]
    : params.transactionId;

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
    toast.success("Payment successful!");
    
    // Add any additional payment verification logic here
  }, [transactionId]);

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-gray-300">Validating payment...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
        <p className="mb-6">Thank you for your purchase!</p>
        <p className="mb-4 text-sm text-gray-600">
          Transaction ID: {transactionId}
        </p>
        <Link href="/user-profile" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          View My Courses
        </Link>
      </div>
    </div>
  );
}