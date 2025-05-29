"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Badge } from "@/components/UI/badge";
import {
  CalendarDays,
  User,
  Tag,
  CreditCard,
  XCircle,
  Info,
} from "lucide-react";
import { useCreatePaymentMutation } from "@/redux/api/payment/paymentApi";
import { useValidateCouponMutation } from "@/redux/api/payment/couponApi";
import { toast } from "sonner";
import { useGetInstallmentPlansQuery } from "@/redux/api/payment/useInstallmentPlansApi";

interface EnrollModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  courseFee: number;
  user: any;
  startDate: string;
}

type CouponType = "fixed" | "percentage";

// API থেকে আসা ইন্সটলমেন্ট প্ল্যানের টাইপ
interface APIInstallmentPlan {
  _id: string;
  name: string; // যেমন: "Full Payment", "2 Installments"
  installments: number; // কিস্তির সংখ্যা
  discountPercent: number; // এই প্ল্যানের জন্য ডিসকাউন্ট পার্সেন্টেজ
  isActive: boolean;
}

export default function EnrollModal({
  open,
  onClose,
  courseId,
  courseTitle,
  courseFee,
  user,
  startDate,
}: EnrollModalProps) {
  const [couponCode, setCouponCode] = useState("");
  // appliedCouponInfo এখন শুধু কুপনের তথ্য ধারণ করবে, ক্যালকুলেটেড ডিসকাউন্ট নয়
  const [appliedCouponInfo, setAppliedCouponInfo] = useState<{
    code?: string;
    couponType?: CouponType;
    couponValue?: number;
    maxDiscount?: number;
  }>({});
  const [showCouponField, setShowCouponField] = useState(false);
  const [couponError, setCouponError] = useState("");

  // কুপন থেকে প্রাপ্ত আসল ডিসকাউন্ট টাকার অঙ্কে
  const [actualCouponDiscount, setActualCouponDiscount] = useState(0);

  const { data: installmentPlansResponse, isLoading: isLoadingInstallmentPlans } =
    useGetInstallmentPlansQuery({});
  
  const installmentPlans: APIInstallmentPlan[] = installmentPlansResponse?.data || [];

  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(null);

  const [totalDiscount, setTotalDiscount] = useState(0);
  const [finalPayableAmount, setFinalPayableAmount] = useState(courseFee);
  const [firstInstallmentAmount, setFirstInstallmentAmount] = useState(0);
  const [subsequentInstallmentAmount, setSubsequentInstallmentAmount] = useState(0);
  const [numberOfSubsequentInstallments, setNumberOfSubsequentInstallments] = useState(0);
  const [installmentPlanDiscountAmount, setInstallmentPlanDiscountAmount] = useState(0);

  const [createPayment, { isLoading: isProcessingPayment }] =
    useCreatePaymentMutation();
  const [validateCoupon, { isLoading: isValidatingCoupon }] =
    useValidateCouponMutation();

  useEffect(() => {
    if (installmentPlans && installmentPlans.length > 0 && !selectedPlanName) {
      const defaultPlan =
        installmentPlans.find((p) => p.installments === 1 && p.isActive) ||
        installmentPlans.find((p) => p.isActive);
      if (defaultPlan) {
        setSelectedPlanName(defaultPlan.name);
      }
    }
  }, [installmentPlans, selectedPlanName]);

  useEffect(() => {
    let currentInstallmentDiscount = 0;
    let subtotalAfterInstallmentDiscount = courseFee;
    let currentAppliedCouponDiscount = 0; // এই ভ্যারিয়েবলটি লোকাল ক্যালকুলেশনের জন্য
    let finalAmount = courseFee;

    const selectedPlanDetails = installmentPlans.find(
      (p) => p.name === selectedPlanName
    );

    if (selectedPlanDetails && selectedPlanDetails.discountPercent > 0) {
      currentInstallmentDiscount =
        (courseFee * selectedPlanDetails.discountPercent) / 100;
    }
    setInstallmentPlanDiscountAmount(currentInstallmentDiscount);
    subtotalAfterInstallmentDiscount = courseFee - currentInstallmentDiscount;

    if (
      appliedCouponInfo.couponType &&
      appliedCouponInfo.couponValue !== undefined
    ) {
      if (appliedCouponInfo.couponType === "percentage") {
        currentAppliedCouponDiscount =
          (subtotalAfterInstallmentDiscount * appliedCouponInfo.couponValue) / 100;
        if (appliedCouponInfo.maxDiscount) {
          currentAppliedCouponDiscount = Math.min(
            currentAppliedCouponDiscount,
            appliedCouponInfo.maxDiscount
          );
        }
      } else { 
        currentAppliedCouponDiscount = appliedCouponInfo.couponValue;
      }
      currentAppliedCouponDiscount = Math.min(
        currentAppliedCouponDiscount,
        subtotalAfterInstallmentDiscount
      );
      currentAppliedCouponDiscount = Math.max(0, currentAppliedCouponDiscount);
    }
    // setAppliedCouponInfo দিয়ে appliedDiscountValue আপডেট করা বন্ধ করা হয়েছে
    setActualCouponDiscount(currentAppliedCouponDiscount); // নতুন স্টেট আপডেট করা হচ্ছে

    finalAmount = subtotalAfterInstallmentDiscount - currentAppliedCouponDiscount;
    finalAmount = Math.max(0, finalAmount);

    setTotalDiscount(currentInstallmentDiscount + currentAppliedCouponDiscount);
    setFinalPayableAmount(finalAmount);

    let firstInst = finalAmount;
    let subsequentInst = 0;
    let numSubsequent = 0;

    if (selectedPlanDetails) {
      if (selectedPlanDetails.installments === 1) {
        firstInst = finalAmount;
      } else if (selectedPlanDetails.installments === 2) {
        firstInst = courseFee * 0.40;
        firstInst = Math.min(firstInst, finalAmount);
        const remainingAfterFirst = finalAmount - firstInst;
        subsequentInst = Math.max(0, remainingAfterFirst);
        numSubsequent = 1;
      } else if (selectedPlanDetails.installments === 3) {
        firstInst = courseFee * 0.30;
        firstInst = Math.min(firstInst, finalAmount);
        const remainingAfterFirst = finalAmount - firstInst;
        subsequentInst = Math.max(0, remainingAfterFirst / (selectedPlanDetails.installments - 1));
        numSubsequent = selectedPlanDetails.installments - 1;
      }
    } else {
        firstInst = finalAmount;
    }
    
    setFirstInstallmentAmount(Math.max(0, firstInst));
    setSubsequentInstallmentAmount(Math.max(0, subsequentInst));
    setNumberOfSubsequentInstallments(numSubsequent);

  }, [selectedPlanName, appliedCouponInfo, courseFee, installmentPlans]); // appliedCouponInfo এখানে dependency হিসেবে ঠিক আছে কারণ আমরা এর ভেতরের appliedDiscountValue আর সেট করছি না

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("অনুগ্রহ করে কুপন কোড লিখুন");
      return;
    }
    setCouponError("");
    setActualCouponDiscount(0); // কুপন অ্যাপ্লাই করার আগে আগের ক্যালকুলেটেড ডিসকাউন্ট রিসেট

    try {
      const res = await validateCoupon({
        code: couponCode.toUpperCase(),
        amount: courseFee, 
      }).unwrap();

      toast.success(`"${res.code}" কুপন সফলভাবে প্রয়োগ করা হয়েছে!`);
      setAppliedCouponInfo({ // এখানে appliedDiscountValue সেট করা হচ্ছে না
        code: res.code,
        couponType: res.couponType,
        couponValue: res.couponValue,
        maxDiscount: res.maxDiscount,
      });
    } catch (err: any) {
      setCouponError(
        err?.data?.message || err?.message || "কুপন কোডটি সঠিক নয় বা মেয়াদ উত্তীর্ণ।"
      );
      setAppliedCouponInfo({}); 
      setActualCouponDiscount(0); // ত্রুটি হলে ক্যালকুলেটেড ডিসকাউন্ট রিসেট
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("অনুগ্রহ করে প্রথমে লগইন করুন");
      return;
    }

    const selectedPlanDetails = installmentPlans.find(
      (p) => p.name === selectedPlanName
    );
    
    const amountToPayNow = (selectedPlanDetails && selectedPlanDetails.installments > 1)
      ? firstInstallmentAmount
      : finalPayableAmount;

    if (amountToPayNow <= 0 && courseFee > 0) { 
        toast.info("আপনার মোট দেয় টাকার পরিমাণ শূন্য বা তার কম। পেমেন্টের প্রয়োজন নেই।");
        return;
    }
    if (amountToPayNow < 0) { 
        toast.error("টাকার পরিমাণ সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।");
        return;
    }

    try {
      const paymentData = {
        amount: amountToPayNow,
        originalCourseFee: courseFee,
        totalPayableAfterDiscounts: finalPayableAmount,
        totalDiscountApplied: totalDiscount,
        installmentPlanDiscount: installmentPlanDiscountAmount,
        couponDiscount: actualCouponDiscount || 0, // নতুন স্টেট থেকে নেওয়া হচ্ছে
        courseId,
        couponCode: appliedCouponInfo.code,
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
      const resp = await createPayment(paymentData).unwrap();
      if (resp.data?.gatewayUrl) {
        window.location.href = resp.data.gatewayUrl;
      } else {
        toast.error("পেমেন্ট গেটওয়ে লিঙ্ক পাওয়া যায়নি।");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "পেমেন্ট শুরু করতে ব্যর্থ।");
    }
  };

  const resetCoupon = () => {
    setShowCouponField(false);
    setCouponCode("");
    setCouponError("");
    setAppliedCouponInfo({});
    setActualCouponDiscount(0); // ক্যালকুলেটেড কুপন ডিসকাউন্টও রিসেট করতে হবে
  };

  const formatDate = (isoDateString: string) => {
    if (!isoDateString) return "N/A";
    return new Date(isoDateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const getCouponOfferDisplay = () => {
    if (!appliedCouponInfo.couponType || appliedCouponInfo.couponValue === undefined)
      return "";
    if (appliedCouponInfo.couponType === "percentage") {
      return `${appliedCouponInfo.couponValue}%`;
    }
    return `${appliedCouponInfo.couponValue}৳`;
  };

  const selectedPlanDetails = installmentPlans.find(p => p.name === selectedPlanName);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[95%] rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-red-700">
            কোর্স এনরোলমেন্ট
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 px-3 sm:px-4 pb-6 max-h-[85vh] overflow-y-auto">
          {/* User Info */}
          <div className="bg-red-50 p-3 sm:p-4 rounded-lg space-y-2 border border-red-200">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="font-medium text-gray-800 text-sm sm:text-base">
                {user?.name || "ব্যবহারকারীর নাম নেই"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="font-medium text-gray-800 text-sm sm:text-base">
                কোর্স শুরু: {formatDate(startDate)}
              </p>
            </div>
          </div>

          {/* Course Info */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
              {courseTitle}
            </h3>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-700">মূল কোর্স ফি:</span>
              <span className="font-semibold text-gray-800">
                {courseFee.toFixed(2)} ৳
              </span>
            </div>
          </div>

          {/* Payment Plan Selection */}
          <div className="space-y-2">
            <p className="font-semibold text-gray-800">পেমেন্ট প্ল্যান নির্বাচন করুন:</p>
            {isLoadingInstallmentPlans ? (
                 <p className="text-sm text-gray-500">প্ল্যান লোড হচ্ছে...</p>
            ) : installmentPlans.length === 0 ? (
                <p className="text-sm text-red-500">কোনো পেমেন্ট প্ল্যান পাওয়া যায়নি।</p>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {installmentPlans.map((plan) => (
                  plan.isActive && (
                    <Button
                      key={plan._id}
                      variant={selectedPlanName === plan.name ? "default" : "outline"}
                      onClick={() => setSelectedPlanName(plan.name)}
                      className={`text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 rounded-md transition-all duration-200
                        ${selectedPlanName === plan.name 
                            ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-300' 
                            : 'border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-400'
                        }`
                      }
                    >
                      {plan.name}
                      {plan.discountPercent > 0 && (
                        <span className="ml-1.5 text-xs">({plan.discountPercent}% ছাড়)</span>
                      )}
                    </Button>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Coupon Section */}
          <div className="space-y-2 pt-2">
            {!showCouponField ? (
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-dashed border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
                onClick={() => setShowCouponField(true)}
              >
                <Tag className="h-4 w-4" />
                কুপন কোড আছে?
              </Button>
            ) : (
              <div className="p-3 bg-gray-50 rounded-md border">
                <div className="flex gap-2 items-center">
                  <Input
                    value={couponCode}
                    onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError(""); 
                    }}
                    placeholder="আপনার কুপন কোড"
                    className="flex-1 focus:ring-red-500 focus:border-red-500"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    variant="outline"
                    className="bg-red-500 text-white hover:bg-red-600 border-red-500 px-3"
                  >
                    {isValidatingCoupon ? "প্রয়োগ হচ্ছে..." : "প্রয়োগ করুন"}
                  </Button>
                </div>
                {couponError && (
                  <p className="text-red-600 text-xs flex items-center gap-1 mt-1.5">
                    <XCircle size={14} /> {couponError}
                  </p>
                )}
                 {appliedCouponInfo.code && !couponError && (
                    <p className="text-green-600 text-xs flex items-center gap-1 mt-1.5">
                        <Info size={14} /> কুপন "{appliedCouponInfo.code}" প্রয়োগ করা হয়েছে ({getCouponOfferDisplay()} ছাড়)।
                    </p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCoupon}
                  className="text-xs text-gray-500 hover:text-red-600 mt-1 p-1 h-auto"
                >
                  কুপন বাতিল করুন
                </Button>
              </div>
            )}
          </div>

          {/* Calculation Summary */}
          <div className="border-t border-b border-gray-200 py-4 space-y-1.5 text-sm sm:text-base">
            {installmentPlanDiscountAmount > 0 && (
                <div className="flex justify-between">
                    <span className="text-gray-600">{selectedPlanDetails?.name} প্ল্যানের ছাড়:</span>
                    <span className="font-medium text-green-600">-{installmentPlanDiscountAmount.toFixed(2)}৳</span>
                </div>
            )}
            {actualCouponDiscount > 0 && appliedCouponInfo.code && ( // শুধুমাত্র কুপন কোড থাকলে এবং ডিসকাউন্ট থাকলে দেখাবে
                <div className="flex justify-between">
                    <span className="text-gray-600">কুপন ({appliedCouponInfo.code} - {getCouponOfferDisplay()}) ছাড়:</span>
                    <span className="font-medium text-green-600">-{actualCouponDiscount.toFixed(2)}৳</span>
                </div>
            )}
            {totalDiscount > 0 && (
                 <div className="flex justify-between font-semibold text-gray-800 pt-1">
                    <span>মোট ছাড়:</span>
                    <span className="text-green-700">-{totalDiscount.toFixed(2)}৳</span>
                </div>
            )}
            <div className="flex justify-between font-bold text-lg text-red-700 pt-1">
              <span>পরিশোধযোগ্য মোট পরিমাণ:</span>
              <span>{finalPayableAmount.toFixed(2)} ৳</span>
            </div>
          </div>
          
          {/* Installment Details Display */}
          {selectedPlanDetails && selectedPlanDetails.installments > 1 && finalPayableAmount > 0 && (
            <div className="bg-red-50 p-3 sm:p-4 rounded-lg space-y-2 border border-red-200 text-sm sm:text-base">
                <h4 className="font-semibold text-red-800 mb-1">কিস্তির বিবরণ:</h4>
                <div className="flex justify-between">
                    <span className="text-gray-700">প্রথম কিস্তি (এখন পরিশোধ করুন):</span>
                    <span className="font-bold text-red-700">{firstInstallmentAmount.toFixed(2)} ৳</span>
                </div>
                {numberOfSubsequentInstallments > 0 && subsequentInstallmentAmount > 0 && (
                    <div className="flex justify-between">
                        <span className="text-gray-700">পরবর্তী {numberOfSubsequentInstallments} টি কিস্তি, প্রতিটি:</span>
                        <span className="font-bold text-red-700">{subsequentInstallmentAmount.toFixed(2)} ৳</span>
                    </div>
                )}
                <p className="text-xs text-red-600 mt-1">
                    {selectedPlanDetails.name === "2 Installments" && "প্রথম কিস্তি মূল কোর্স ফির ৪০% হিসাবে গণনা করা হয়েছে। "}
                    {selectedPlanDetails.name === "3 Installments" && "প্রথম কিস্তি মূল কোর্স ফির ৩০% হিসাবে গণনা করা হয়েছে। "}
                    বাকি টাকা মোট দেয় টাকার উপর ভিত্তি করে সমন্বয় করা হবে।
                </p>
            </div>
          )}


          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessingPayment || (finalPayableAmount <= 0 && courseFee > 0) || isLoadingInstallmentPlans || (finalPayableAmount < 0)}
            className="w-full py-3 text-base sm:text-lg font-semibold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {isProcessingPayment
              ? "পেমেন্ট প্রসেস হচ্ছে..."
              : selectedPlanDetails && selectedPlanDetails.installments > 1
              ? `${firstInstallmentAmount.toFixed(0)}৳ প্রথম কিস্তি পরিশোধ করুন`
              : `${finalPayableAmount.toFixed(0)}৳ সম্পূর্ণ পরিশোধ করুন`}
          </Button>

          <p className="text-center text-xs text-gray-500">
            আপনার পেমেন্ট SSLCommerz এর মাধ্যমে নিরাপদে সম্পন্ন হবে।
          </p>
        </div> 

        {/*   
         */}
      </DialogContent>
    </Dialog>
  );
}
// 