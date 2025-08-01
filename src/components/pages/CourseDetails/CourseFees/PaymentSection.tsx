"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  User,
  CreditCard,
  ShieldCheck,
  FileText,
  ArrowRight,
  BadgePercent,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation"; // Using Next.js 13+ App Router

// --- Import your actual hooks from your project structure ---
import { useGetCourseBySlugQuery } from "@/redux/api/courseApi"; // Example path
import { useGetInstallmentPlansQuery } from "@/redux/api/payment/useInstallmentPlansApi"; // Example path
import { useInitiatePaymentMutation } from "@/redux/api/payment/paymentApi"; // Example path
import { toast } from "sonner"; // Assuming you use sonner for toasts

// --- Interfaces (ensure these match your API response structures) ---
interface APIInstallmentPlan {
  _id: string;
  name: string;
  installments: number;
  discountPercent: number;
  isActive: boolean;
}

interface Course {
  _id: string;
  title: string;
  courseFee: number;
  schedule: {
    startingDate: string;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  mobileNumber?: string;
}

interface PaymentSectionProps {
  course: Course;
  user: User | null;
}

// --- Main Payment Component (Receives props from the page) ---
export function PaymentSection({ course, user }: PaymentSectionProps) {
  // Fetches installment plans
  const {
    data: installmentPlansResponse,
    isLoading: isLoadingInstallmentPlans,
  } = useGetInstallmentPlansQuery({});
  const installmentPlans: APIInstallmentPlan[] =
    installmentPlansResponse?.data || [];

  // Hook for initiating the payment process
  const [initiatePayment, { isLoading: isProcessingPayment }] =
    useInitiatePaymentMutation();

  // State for managing payment calculations
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);
  const [finalPayableAmount, setFinalPayableAmount] = useState(
    course.courseFee
  );
  const [firstInstallmentAmount, setFirstInstallmentAmount] = useState(0);
  const [subsequentInstallmentAmount, setSubsequentInstallmentAmount] =
    useState(0);
  const [numberOfSubsequentInstallments, setNumberOfSubsequentInstallments] =
    useState(0);
  const [installmentPlanDiscountAmount, setInstallmentPlanDiscountAmount] =
    useState(0);

  // Effect to set the default payment plan once plans are loaded
  useEffect(() => {
    if (installmentPlans.length > 0 && !selectedPlanName) {
      const defaultPlan = installmentPlans.find((p) => p.isActive);
      if (defaultPlan) {
        setSelectedPlanName(defaultPlan.name);
      }
    }
  }, [installmentPlans, selectedPlanName]);

  // Effect to recalculate all amounts when the selected plan or course changes
  useEffect(() => {
    let currentInstallmentDiscount = 0;
    let finalAmount = course.courseFee;

    const selectedPlanDetails = installmentPlans.find(
      (p) => p.name === selectedPlanName
    );

    if (selectedPlanDetails && selectedPlanDetails.discountPercent > 0) {
      currentInstallmentDiscount =
        (course.courseFee * selectedPlanDetails.discountPercent) / 100;
    }

    setInstallmentPlanDiscountAmount(currentInstallmentDiscount);
    finalAmount = course.courseFee - currentInstallmentDiscount;
    finalAmount = Math.max(0, finalAmount);
    setFinalPayableAmount(finalAmount);

    let firstInst = finalAmount;
    let subsequentInst = 0;
    let numSubsequent = 0;

    if (selectedPlanDetails) {
      if (selectedPlanDetails.installments === 1) {
        firstInst = finalAmount;
      } else if (selectedPlanDetails.installments === 2) {
        firstInst = course.courseFee * 0.4; // 40% of original fee
        firstInst = Math.min(firstInst, finalAmount);
        const remainingAfterFirst = finalAmount - firstInst;
        subsequentInst = Math.max(0, remainingAfterFirst);
        numSubsequent = 1;
      } else if (selectedPlanDetails.installments === 3) {
        firstInst = course.courseFee * 0.3; // 30% of original fee
        firstInst = Math.min(firstInst, finalAmount);
        const remainingAfterFirst = finalAmount - firstInst;
        subsequentInst = Math.max(
          0,
          remainingAfterFirst / (selectedPlanDetails.installments - 1)
        );
        numSubsequent = selectedPlanDetails.installments - 1;
      }
    } else {
      firstInst = finalAmount;
    }

    setFirstInstallmentAmount(Math.max(0, firstInst));
    setSubsequentInstallmentAmount(Math.max(0, subsequentInst));
    setNumberOfSubsequentInstallments(numSubsequent);
  }, [selectedPlanName, course, installmentPlans]);

  // Handler for the online payment button
  const handleOnlinePayment = async () => {
    if (!user) {
      toast.error("পেমেন্ট করার জন্য অনুগ্রহ করে লগইন করুন।");
      return;
    }
    const selectedPlanDetails = installmentPlans.find(
      (p) => p.name === selectedPlanName
    );
    const amountToPayNow =
      selectedPlanDetails && selectedPlanDetails.installments > 1
        ? firstInstallmentAmount
        : finalPayableAmount;

    if (amountToPayNow < 0) {
      toast.error("টাকার পরিমাণ সঠিক নয়।");
      return;
    }

    try {
      const paymentData = {
        amount: amountToPayNow,
        originalCourseFee: course.courseFee,
        totalPayableAfterDiscounts: finalPayableAmount,
        totalDiscountApplied: installmentPlanDiscountAmount,
        installmentPlanDiscount: installmentPlanDiscountAmount,
        courseId: course._id,
        paymentPlan: selectedPlanName,
        numberOfInstallments: selectedPlanDetails?.installments || 1,
        isFullPayment: (selectedPlanDetails?.installments || 1) === 1,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber || "N/A",
        },
      };
      // Call the mutation to get the payment gateway URL
      const resp = await initiatePayment(paymentData).unwrap();
      if (resp.data?.gatewayUrl) {
        // Redirect the user to the payment gateway
        window.location.href = resp.data.gatewayUrl;
      } else {
        toast.error("পেমেন্ট গেটওয়ে লিঙ্ক পাওয়া যায়নি।");
      }
    } catch (err) {
      const errorMessage =
        (err as Error)?.message ||
        (typeof err === "string" ? err : "") ||
        "পেমেন্ট শুরু করতে ব্যর্থ।";
      toast.error(errorMessage);
    }
  };

  // Helper to format date strings
  const formatDate = (isoDateString: string) => {
    if (!isoDateString) return "N/A";
    return new Date(isoDateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const selectedPlanDetails = installmentPlans.find(
    (p) => p.name === selectedPlanName
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left Column: Payment Details */}
      <div className="lg:col-span-3 bg-white rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
          আপনার পেমেন্ট
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-red-600 mb-3">
            {course.title}
          </h3>
          <div className="flex items-center gap-3 text-gray-600 mb-2">
            <User className="h-5 w-5 text-red-500" />
            <span className="font-medium">{user?.name || "ব্যবহারকারী"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <CalendarDays className="h-5 w-5 text-red-500" />
            <span className="font-medium">
              কোর্স শুরু: {formatDate(course.schedule.startingDate)}
            </span>
          </div>
        </div>

        <div>
          <label className="font-semibold text-gray-700 mb-3 block">
            পেমেন্ট প্ল্যান নির্বাচন করুন:
          </label>
          {isLoadingInstallmentPlans ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin h-4 w-4" /> প্ল্যান লোড হচ্ছে...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {installmentPlans.map(
                (plan) =>
                  plan.isActive && (
                    <button
                      key={plan._id}
                      onClick={() => setSelectedPlanName(plan.name)}
                      className={`p-3 text-center rounded-lg border-2 transition-all duration-200 ${
                        selectedPlanName === plan.name
                          ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                          : "border-gray-300 bg-white hover:border-red-400"
                      }`}>
                      <span className="font-semibold block text-gray-800">
                        {plan.name}
                      </span>
                      {plan.discountPercent > 0 && (
                        <span className="text-xs font-bold text-green-600">
                          ({plan.discountPercent}% ছাড়)
                        </span>
                      )}
                    </button>
                  )
              )}
            </div>
          )}
        </div>

        <div className="border-t-2 border-dashed pt-6 space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">মূল কোর্স ফি:</span>
            <span className="font-medium text-gray-800">
              {course.courseFee.toFixed(2)} ৳
            </span>
          </div>
          {installmentPlanDiscountAmount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="flex items-center gap-1">
                <BadgePercent size={14} /> {selectedPlanDetails?.name} প্ল্যানের
                ছাড়:
              </span>
              <span className="font-medium">
                -{installmentPlanDiscountAmount.toFixed(2)} ৳
              </span>
            </div>
          )}
          <div className="border-t my-2"></div>
          <div className="flex justify-between items-center text-lg font-bold text-red-600 pt-2">
            <span>পরিশোধযোগ্য মোট পরিমাণ:</span>
            <span>{finalPayableAmount.toFixed(2)} ৳</span>
          </div>
        </div>
      </div>

      {/* Right Column: Actions & Installments */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            কিস্তির বিবরণ
          </h3>
          {selectedPlanDetails &&
          selectedPlanDetails.installments > 1 &&
          finalPayableAmount > 0 ? (
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-gray-600">প্রথম কিস্তি (এখন পরিশোধ করুন)</p>
                <p className="text-2xl font-bold text-red-700">
                  {firstInstallmentAmount.toFixed(2)} ৳
                </p>
              </div>
              {numberOfSubsequentInstallments > 0 &&
                subsequentInstallmentAmount > 0 && (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-600">
                      পরবর্তী {numberOfSubsequentInstallments} টি কিস্তির
                      প্রত্যেকটি
                    </p>
                    <p className="text-xl font-semibold text-gray-800">
                      {subsequentInstallmentAmount.toFixed(2)} ৳
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      বাকি টাকা মোট দেয় টাকার উপর ভিত্তি করে সমন্বয় করা হবে।
                    </p>
                  </div>
                )}
            </div>
          ) : (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <p className="text-gray-600">সম্পূর্ণ পেমেন্ট একসাথে</p>
              <p className="text-2xl font-bold text-green-700">
                {finalPayableAmount.toFixed(2)} ৳
              </p>
              <p className="text-xs text-green-600 mt-1">
                একসাথে পেমেন্ট করে সর্বোচ্চ ছাড় উপভোগ করুন!
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 space-y-4">
          <div className="space-y-3">
            <button
              onClick={handleOnlinePayment}
              disabled={isProcessingPayment || isLoadingInstallmentPlans}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-rose-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed">
              {isProcessingPayment ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <CreditCard />
              )}
              <span>
                {isProcessingPayment
                  ? "প্রসেস হচ্ছে..."
                  : "অনলাইনে পেমেন্ট করুন"}
              </span>
            </button>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSe27ZcsU6VdsyYPMD4JO5VwW4d9CI3_HtTG8YRxyo43gyzGWA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-gray-900 transition-all duration-300">
              <FileText />
              <span>ম্যানুয়াল পেমেন্ট</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-600" /> আপনার পেমেন্ট
              SSLCommerz এর মাধ্যমে ১০০% নিরাপদ।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
