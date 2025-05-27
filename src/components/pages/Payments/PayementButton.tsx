// components/PaymentButton.tsx
"use client";
import { toast } from "sonner";
import { useUser } from "@/context/user.provider";
import { useCreatePaymentMutation } from "@/redux/api/payment/paymentApi";

export default function PaymentButton({ 
  courseId, 
  amount 
}: {
  courseId: string;
  amount: number;
}) {
  const { user } = useUser();
  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to proceed with payment");
      return;
    }

    try {
      const response = await createPayment({
        amount,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber || "017XXXXXXXX",
        },
        courseId,
      }).unwrap();

      // Redirect to SSLCommerz payment page
      if (response.data?.gatewayUrl) {
        window.location.href = response.data.gatewayUrl;
      }
    } catch (error) {
      toast.error("Failed to initiate payment. Please try again.");
      console.error("Payment error:", error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? "Processing..." : "Pay Now"}
    </button>
  );
}