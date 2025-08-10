"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Separator } from '@/components/UI/separator';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  DollarSign,
  Check,
  X,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Copy,
  Globe,
  Shield,
  CheckCircle,
  XCircle,
  Book,
  Hash,
  Banknote,
  Building
} from 'lucide-react';
import { useGetPaymentByIdQuery, useUpdatePaymentMutation } from '@/redux/api/payment/paymentApi';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";

interface PaymentDetails {
  _id: string;
  transactionId: string;
  user: {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
  };
  course: {
    _id: string;
    title: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refund';
  cardType?: string;
  cardIssuer?: string;
  paymentMethod?: string;
  bankTransactionId?: string;
  checking: boolean;
  ipnReceived?: boolean;
  ipnValidated?: boolean;
  isInstallment?: boolean;
  installmentPlan?: string;
  installmentNumber?: number;
  totalInstallments?: number;
  couponCode?: string;
  couponDiscount?: number;
  originalAmount?: number;
  sessionkey?: string;
  gatewayPageURL?: string;
  directPaymentURL?: string;
  redirectGatewayURL?: string;
  redirectFailURL?: string;
  redirectCancelURL?: string;
  failReason?: string;
  riskLevel?: string;
  riskTitle?: string;
  createdAt: string;
  updatedAt: string;
}

const PaymentDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const paymentId = params?.id as string;

  const { data: paymentData, isLoading, refetch } = useGetPaymentByIdQuery(paymentId);
  const [markAsChecked, { isLoading: isMarkingChecked }] = useUpdatePaymentMutation();

  const payment: PaymentDetails = paymentData?.data;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleMarkAsChecked = async () => {
    try {
      await markAsChecked({
        id: paymentId,
        checking: true
      }).unwrap();
      toast.success("Payment marked as checked successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to mark payment as checked");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: X },
      refund: { color: 'bg-purple-100 text-purple-800', icon: ArrowLeft }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-4 h-4 mr-1" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const InfoCard = ({ title, children, icon: Icon }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );

  const InfoRow = ({ label, value, copyable = false }: { label: string; value: any; copyable?: boolean }) => (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-900">{value}</span>
        {copyable && value && (
          <Copy 
            className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600" 
            onClick={() => handleCopy(value.toString())}
          />
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Not Found</h2>
              <p className="text-gray-600 mb-4">The payment details you're looking for could not be found.</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
                <p className="text-gray-600">Transaction ID: {payment.transactionId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(payment.status)}
              {!payment.checking && (
                <Button
                  onClick={handleMarkAsChecked}
                  disabled={isMarkingChecked}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Mark as Checked
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Information */}
            <InfoCard title="User Information" icon={User}>
              <InfoRow label="Full Name" value={payment.user?.name} copyable />
              <InfoRow label="Email" value={payment.user?.email} copyable />
              <InfoRow label="Mobile Number" value={payment.user?.mobileNumber} copyable />
              <InfoRow label="User ID" value={payment.user?._id} copyable />
            </InfoCard>

            {/* Course Information */}
            <InfoCard title="Course Information" icon={Book}>
              <InfoRow label="Course Title" value={payment.course?.title} copyable />
              <InfoRow label="Course ID" value={payment.course?._id} copyable />
              {payment.isInstallment && (
                <>
                  <InfoRow 
                    label="Installment" 
                    value={`${payment.installmentNumber}/${payment.totalInstallments}`} 
                  />
                  {payment.installmentPlan && (
                    <InfoRow label="Plan" value={payment.installmentPlan} />
                  )}
                </>
              )}
            </InfoCard>

            {/* Payment Information */}
            <InfoCard title="Payment Information" icon={DollarSign}>
              <InfoRow label="Amount" value={formatAmount(payment.amount)} />
              {payment.originalAmount && payment.originalAmount !== payment.amount && (
                <InfoRow label="Original Amount" value={formatAmount(payment.originalAmount)} />
              )}
              {payment.couponCode && (
                <>
                  <InfoRow label="Coupon Code" value={payment.couponCode} copyable />
                  {payment.couponDiscount && (
                    <InfoRow label="Discount" value={formatAmount(payment.couponDiscount)} />
                  )}
                </>
              )}
              <InfoRow label="Payment Method" value={payment.paymentMethod || 'SSLCommerz'} />
              {payment.cardType && <InfoRow label="Card Type" value={payment.cardType} />}
              {payment.cardIssuer && <InfoRow label="Card Issuer" value={payment.cardIssuer} />}
            </InfoCard>

            {/* Transaction Information */}
            <InfoCard title="Transaction Information" icon={CreditCard}>
              <InfoRow label="Transaction ID" value={payment.transactionId} copyable />
              {payment.bankTransactionId && (
                <InfoRow label="Bank Transaction ID" value={payment.bankTransactionId} copyable />
              )}
              {payment.sessionkey && (
                <InfoRow label="Session Key" value={payment.sessionkey} copyable />
              )}
              <InfoRow label="Status" value={getStatusBadge(payment.status)} />
              <InfoRow 
                label="Review Status" 
                value={payment.checking ? (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Check className="w-3 h-3 mr-1" />
                    Reviewed
                  </Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pending Review
                  </Badge>
                )}
              />
            </InfoCard>

            {/* Security & Validation */}
            <InfoCard title="Security & Validation" icon={Shield}>
              <InfoRow 
                label="IPN Received" 
                value={payment.ipnReceived ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Yes
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    No
                  </Badge>
                )}
              />
              <InfoRow 
                label="IPN Validated" 
                value={payment.ipnValidated ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Yes
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    No
                  </Badge>
                )}
              />
              {payment.riskLevel && (
                <InfoRow label="Risk Level" value={payment.riskLevel} />
              )}
              {payment.riskTitle && (
                <InfoRow label="Risk Title" value={payment.riskTitle} />
              )}
              {payment.failReason && (
                <InfoRow label="Failure Reason" value={payment.failReason} />
              )}
            </InfoCard>

            {/* Date Information */}
            <InfoCard title="Date Information" icon={Calendar}>
              <InfoRow 
                label="Created At" 
                value={format(new Date(payment.createdAt), 'MMMM dd, yyyy at hh:mm a')} 
              />
              <InfoRow 
                label="Updated At" 
                value={format(new Date(payment.updatedAt), 'MMMM dd, yyyy at hh:mm a')} 
              />
              <InfoRow 
                label="Time Ago" 
                value={format(new Date(payment.createdAt), 'EEEE, MMMM dd, yyyy')} 
              />
            </InfoCard>
          </div>

          {/* Gateway URLs (if available) */}
          {(payment.gatewayPageURL || payment.redirectGatewayURL || payment.redirectFailURL) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Gateway URLs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payment.gatewayPageURL && (
                  <InfoRow label="Gateway Page URL" value={payment.gatewayPageURL} copyable />
                )}
                {payment.directPaymentURL && (
                  <InfoRow label="Direct Payment URL" value={payment.directPaymentURL} copyable />
                )}
                {payment.redirectGatewayURL && (
                  <InfoRow label="Redirect Gateway URL" value={payment.redirectGatewayURL} copyable />
                )}
                {payment.redirectFailURL && (
                  <InfoRow label="Redirect Fail URL" value={payment.redirectFailURL} copyable />
                )}
                {payment.redirectCancelURL && (
                  <InfoRow label="Redirect Cancel URL" value={payment.redirectCancelURL} copyable />
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Need to take action on this payment?
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push(`/dashboard/payments/user-history/${payment.user?._id}`)}
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    View User History
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default PaymentDetailsPage;
