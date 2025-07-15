"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import {
  CalendarDays,
  User,
  CreditCard,
  Info,
  BookOpen,
  ShieldCheck,
  Mail,
  ChevronDown,
} from "lucide-react";
import { useCreatePaymentMutation } from "@/redux/api/payment/paymentApi";
import { toast } from "sonner";

// Props interface for the component
interface EnrollModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  courseFee: number;
  user: any; // Consider defining a more specific user type
  startDate: string;
}

/**
 * A redesigned modal for course enrollment and payment processing via SSLCommerz.
 * This component is simplified to handle only full payments, removing installment and coupon complexity.
 * It features a clean, white design with red accents and collapsible instructions.
 */
export default function SslcommerzPayment({
  open,
  onClose,
  courseId,
  courseTitle,
  courseFee,
  user,
  startDate,
}: EnrollModalProps) {
  // State to manage the visibility of the instructions
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Mutation hook for creating a payment session
  const [createPayment, { isLoading: isProcessing }] =
    useCreatePaymentMutation();

  /**
   * Handles the payment process when the user clicks the pay button.
   * It constructs the payment data and calls the createPayment mutation.
   * On success, it redirects the user to the SSLCommerz gateway.
   */
  const handlePayment = async () => {
    // Ensure the user is logged in before proceeding
    if (!user) {
      toast.error("Please log in to enroll in the course.");
      return;
    }

    // Basic validation for the course fee
    if (courseFee <= 0) {
      toast.info(
        "This course is free. No payment is required for enrollment."
      );
      // Here you might want to call an enrollment endpoint for free courses
      onClose();
      return;
    }

    try {
      // Prepare the data payload for the payment API
      const paymentData = {
        amount: courseFee,
        courseId,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber || "N/A",
        },
        // Add other relevant fields required by your backend
        originalCourseFee: courseFee,
        totalPayableAfterDiscounts: courseFee,
        isFullPayment: true,
      };

      // Call the mutation to create a payment session
      const response = await createPayment(paymentData).unwrap();

      // Redirect to the payment gateway if the URL is provided
      if (response.data?.gatewayUrl) {
        window.location.href = response.data.gatewayUrl;
      } else {
        toast.error("Could not retrieve the payment gateway link. Please try again.");
      }
    } catch (err: any) {
      // Handle any errors during the payment initiation
      toast.error(
        err?.data?.message || "Failed to initiate payment. Please try again later."
      );
    }
  };

  /**
   * Formats an ISO date string into a more readable format.
   * @param isoDateString - The date string to format.
   * @returns A formatted date string (e.g., "July 15, 2025").
   */
  const formatDate = (isoDateString: string) => {
    if (!isoDateString) return "Not specified";
    return new Date(isoDateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95%] bg-white text-black border-gray-200 border rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold tracking-wider text-gray-800">
            Enrollment Confirmation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1 max-h-[85vh] overflow-y-auto">
          {/* SSLCommerz Instructions (Collapsible) */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full font-semibold text-red-500 flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Payment Steps
              </span>
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-300 ${
                  showInstructions ? "rotate-180" : ""
                }`}
              />
            </button>
            {showInstructions && (
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 mt-3 animate-in fade-in-50 duration-500">
                <li>Click the "Proceed to Pay" button below.</li>
                <li>You will be redirected to the secure SSLCommerz gateway.</li>
                <li>Select your preferred payment method (Card, MFS, etc.).</li>
                <li>After successful payment, you will be returned to our site.</li>
              </ol>
            )}
          </div>

          {/* Enrollment Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 mt-1 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-gray-500 text-sm">Course</p>
                <p className="font-semibold text-base text-gray-800">{courseTitle}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 mt-1 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-gray-500 text-sm">Student</p>
                <p className="font-semibold text-base text-gray-800">{user?.name || "Guest"}</p>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-1 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-semibold text-base text-gray-800">{user?.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="h-5 w-5 mt-1 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-gray-500 text-sm">Start Date</p>
                <p className="font-semibold text-base text-gray-800">{formatDate(startDate)}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t border-b border-gray-200 py-4 space-y-2">
            <div className="flex justify-between items-center text-gray-600">
              <span>Course Fee</span>
              <span>{courseFee.toFixed(2)} BDT</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg pt-2">
              <span className="text-gray-900">Total Amount to Pay</span>
              <span className="text-red-500">{courseFee.toFixed(2)} BDT</span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-12 text-lg font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <CreditCard className="h-6 w-6 mr-2.5" />
            {isProcessing ? "Processing..." : "Proceed to Pay"}
          </Button>

          {/* Secure Payment Footer */}
          <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>Secure Payment via SSLCommerz</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
