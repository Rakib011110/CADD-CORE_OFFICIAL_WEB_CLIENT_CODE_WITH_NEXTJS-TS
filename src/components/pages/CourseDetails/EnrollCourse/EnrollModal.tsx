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
} from "lucide-react";
import { useCreatePaymentMutation } from "@/redux/api/payment/paymentApi";
import { toast } from "sonner";
import { useValidateCouponMutation } from "@/redux/api/payment/couponApi";

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
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(courseFee);
  const [showCouponField, setShowCouponField] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponInfo, setCouponInfo] = useState<{
    couponType?: CouponType;
    couponValue?: number;
    maxDiscount?: number;
  }>({});

  const [createPayment, { isLoading: isProcessingPayment }] =
    useCreatePaymentMutation();
  const [validateCoupon, { isLoading: isValidating }] =
    useValidateCouponMutation();

  // Reset final amount and discount when courseFee changes
  useEffect(() => {
    setFinalAmount(courseFee);
    setDiscount(0);
    setCouponInfo({});
  }, [courseFee]);

  // Debug
  useEffect(() => {
    console.log({ courseFee, discount, finalAmount, couponInfo });
  }, [courseFee, discount, finalAmount, couponInfo]);

  // Apply coupon via RTK Query
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("অনুগ্রহ করে কুপন কোড লিখুন");
      return;
    }
    setCouponError("");

    try {
      const res = await validateCoupon({
        code: couponCode.toUpperCase(),
        amount: courseFee,
      }).unwrap();

      // Unwrap returns actual response object
      // Destructure directly from res
      const {
        couponType,
        couponValue,
        maxDiscount,
        discountAmount,
        finalAmount: computedFinal,
      } = res;

      // Sanity check
      if (
        typeof discountAmount !== "number" ||
        isNaN(discountAmount) ||
        typeof computedFinal !== "number" ||
        isNaN(computedFinal)
      ) {
        throw new Error("Invalid discount calculation");
      }

      setDiscount(discountAmount);
      setFinalAmount(computedFinal);
      setCouponInfo({ couponType, couponValue, maxDiscount });
    } catch (err: any) {
      console.error("Coupon error:", err);
      setCouponError(err.message || "কুপন প্রয়োগ ব্যর্থ");
      // reset
      setDiscount(0);
      setFinalAmount(courseFee);
      setCouponInfo({});
    }
  };

  // Payment
  const handlePayment = async () => {
    if (!user) {
      toast.error("অনুগ্রহ করে প্রথমে লগইন করুন");
      return;
    }
    try {
      const paymentData = {
        amount: finalAmount,
        originalAmount: courseFee,
        discountAmount: discount,
        courseId,
        coupon: couponInfo.couponType ? couponCode.toUpperCase() : null,
        couponType: couponInfo.couponType,
        couponValue: couponInfo.couponValue,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber || "01700000000",
        },
      };
      const resp = await createPayment(paymentData).unwrap();
      window.location.href = resp.data.gatewayUrl;
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "পেমেন্ট শুরু করতে ব্যর্থ");
    }
  };

  const resetCoupon = () => {
    setShowCouponField(false);
    setCouponCode("");
    setDiscount(0);
    setFinalAmount(courseFee);
    setCouponError("");
    setCouponInfo({});
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

  const getCouponDisplay = () => {
    if (!couponInfo.couponType || couponInfo.couponValue === undefined)
      return "";
    if (couponInfo.couponType === "percentage") {
      return `${couponInfo.couponValue}% ছাড়${
        couponInfo.maxDiscount ? ` (সর্বোচ্চ ${couponInfo.maxDiscount}৳)` : ""
      }`;
    }
    return `${couponInfo.couponValue}৳ ছাড়`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-blue-800">
            কোর্স এনরোলমেন্ট
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 px-2 pb-6">
          {/* User & Date */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <p className="font-semibold">{user?.name || "-"}</p>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              <p className="font-semibold">{formatDate(startDate)}</p>
            </div>
          </div>

          {/* Course Fee */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-bold mb-2">{courseTitle}</h3>
            <div className="flex justify-between">
              <span>মূল ফি:</span>
              <span className="font-semibold">{courseFee.toFixed(2)} ৳</span>
            </div>
          </div>

          {/* Coupon */}
          <div className="space-y-3">
            {!showCouponField ? (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => setShowCouponField(true)}
              >
                <Tag className="h-4 w-4" />
                কুপন কোড
              </Button>
            )  : (
              <>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="COUPON"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isValidating}
                    variant="outline"
                  >
                    {isValidating ? "অপেক্ষা..." : "অ্যাপ্লাই"}
                  </Button>
                </div>
                {couponError && (
                  <p className="text-red-600 flex items-center gap-1">
                    <XCircle /> {couponError}
                  </p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCoupon}
                  className="text-gray-500"
                >
                  বাতিল
                </Button>
              </>
            )}

            {discount > 0 && (
              <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                <span className="text-green-700">ছাড়:</span>
                <Badge className="bg-green-100 text-green-800">
                  {getCouponDisplay()} -{discount.toFixed(2)}৳
                </Badge>
              </div>
            )}
          </div>

          {/* Final Amount */}
          <div className="bg-red-50 p-4 rounded-lg flex justify-between">
            <span className="font-semibold">মোট:</span>
            <span className="font-bold text-blue-700">
              {finalAmount.toFixed(2)} ৳
            </span>
          </div>

          {/* Pay */}
          <Button
            onClick={handlePayment}
            disabled={isProcessingPayment || finalAmount <= 0}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {isProcessingPayment ? "প্রসেসিং..." : "নিরাপদে পেমেন্ট করুন"}
          </Button>

          <p className="text-center text-xs text-gray-500">
            পেমেন্ট SSLCommerz-এ সম্পন্ন হবে।
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
















