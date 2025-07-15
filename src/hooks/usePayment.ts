// hooks/usePayment.ts - Frontend Payment Hook
import { useState } from 'react';
import { useCreatePaymentMutation } from '@/redux/api/payment/paymentApi';
import { toast } from 'sonner';

interface UsePaymentProps {
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

interface PaymentData {
  amount: number;
  originalCourseFee: number;
  totalPayableAfterDiscounts: number;
  totalDiscountApplied: number;
  installmentPlanDiscount: number;
  couponDiscount: number;
  courseId: string;
  couponCode?: string;
  paymentPlan?: string;
  numberOfInstallments?: number;
  isFullPayment?: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    mobileNumber?: string;
  };
}

export const usePayment = ({ onSuccess, onError }: UsePaymentProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [createPayment, { isLoading: isMutationLoading }] = useCreatePaymentMutation();

  const processPayment = async (paymentData: PaymentData) => {
    if (isProcessing || isMutationLoading) {
      toast.warning('Payment is already being processed...');
      return;
    }

    // Validate payment data
    if (!paymentData.amount || paymentData.amount <= 0) {
      const error = 'Invalid payment amount';
      toast.error(error);
      onError?.(error);
      return;
    }

    if (!paymentData.user?._id || !paymentData.user?.email || !paymentData.user?.name) {
      const error = 'Complete user information is required';
      toast.error(error);
      onError?.(error);
      return;
    }

    if (!paymentData.courseId) {
      const error = 'Course ID is required';
      toast.error(error);
      onError?.(error);
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🔧 Processing payment with data:', {
        amount: paymentData.amount,
        courseId: paymentData.courseId,
        userEmail: paymentData.user.email,
        paymentPlan: paymentData.paymentPlan,
        couponCode: paymentData.couponCode
      });

      const response = await createPayment({
        amount: paymentData.amount,
        originalCourseFee: paymentData.originalCourseFee,
        totalPayableAfterDiscounts: paymentData.totalPayableAfterDiscounts,
        totalDiscountApplied: paymentData.totalDiscountApplied,
        installmentPlanDiscount: paymentData.installmentPlanDiscount,
        couponDiscount: paymentData.couponDiscount,
        courseId: paymentData.courseId,
        couponCode: paymentData.couponCode,
        paymentPlan: paymentData.paymentPlan,
        numberOfInstallments: paymentData.numberOfInstallments || 1,
        isFullPayment: paymentData.isFullPayment ?? true,
        user: {
          _id: paymentData.user._id,
          name: paymentData.user.name,
          email: paymentData.user.email,
          mobileNumber: paymentData.user.mobileNumber || "N/A",
        },
      }).unwrap();

      console.log('✅ Payment response received:', {
        success: response.success,
        hasGatewayUrl: !!response.data?.gatewayUrl,
        transactionId: response.data?.transactionId
      });

      if (response.success && response.data?.gatewayUrl) {
        toast.success('Redirecting to payment gateway...');
        
        // Add a small delay to ensure toast is visible
        setTimeout(() => {
          window.location.href = response.data.gatewayUrl;
        }, 1000);
        
        onSuccess?.(response.data.transactionId);
      } else {
        throw new Error(response.message || 'Payment gateway URL not received');
      }

    } catch (error: any) {
      console.error('❌ Payment processing failed:', error);
      
      const errorMessage = error?.data?.message || 
                          error?.message || 
                          'Payment processing failed. Please try again.';
      
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing: isProcessing || isMutationLoading
  };
};

export default usePayment;
