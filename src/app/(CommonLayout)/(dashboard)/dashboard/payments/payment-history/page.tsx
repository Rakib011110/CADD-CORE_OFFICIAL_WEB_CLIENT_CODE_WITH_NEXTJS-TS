"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/UI/table';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Check,
  X,
  Clock,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import { useGetUserPaymentHistoryQuery } from '@/redux/api/payment/paymentApi';
import { format } from 'date-fns';

interface Payment {
  _id: string;
  transactionId: string;
  userDetails: {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
  };
  courseDetails: {
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
  createdAt: string;
  updatedAt: string;
}

interface PaymentSummary {
  totalAmount: number;
  totalPayments: number;
  completedPayments: number;
  failedPayments: number;
  pendingPayments: number;
  lastPaymentDate: string | null;
}

const UserPaymentHistory = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  const [currentPage, setCurrentPage] = useState(1);

  const { data: paymentData, isLoading } = useGetUserPaymentHistoryQuery({
    userId,
    page: currentPage,
    limit: 10
  });

  const payments: Payment[] = paymentData?.data?.payments || [];
  const summary: PaymentSummary = paymentData?.data?.summary || {};
  const pagination = paymentData?.data?.pagination || {};

  const userInfo = payments[0]?.userDetails;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', icon: Check },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800', icon: X },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: X },
      refund: { color: 'bg-purple-100 text-purple-800', icon: ArrowLeft }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getCheckingBadge = (checking: boolean) => {
    return checking ? (
      <Badge className="bg-blue-100 text-blue-800">
        <Check className="w-3 h-3 mr-1" />
        Reviewed
      </Badge>
    ) : (
      <Badge className="bg-orange-100 text-orange-800">
        <AlertCircle className="w-3 h-3 mr-1" />
        Pending Review
      </Badge>
    );
  };

  const SummaryCard = ({ title, value, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
          </div>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Payment History</h1>
            <p className="text-gray-600">Complete payment records for selected user</p>
          </div>
        </div>

        {/* User Information */}
        {userInfo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{userInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{userInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{userInfo.mobileNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            title="Total Payments"
            value={summary.totalPayments || 0}
            icon={FileText}
            color="text-blue-600"
          />
          <SummaryCard
            title="Total Amount"
            value={formatAmount(summary.totalAmount || 0)}
            icon={DollarSign}
            color="text-green-600"
          />
          <SummaryCard
            title="Completed"
            value={summary.completedPayments || 0}
            icon={Check}
            color="text-green-600"
          />
          <SummaryCard
            title="Failed"
            value={summary.failedPayments || 0}
            icon={X}
            color="text-red-600"
          />
        </div>

        {/* Last Payment Date */}
        {summary.lastPaymentDate && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                Last Payment: {format(new Date(summary.lastPaymentDate), 'MMMM dd, yyyy at hh:mm a')}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Payment History</CardTitle>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Details</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Review Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment: Payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded block mb-1">
                          {payment.transactionId}
                        </code>
                        {payment.bankTransactionId && (
                          <div className="text-xs text-gray-500">
                            Bank ID: {payment.bankTransactionId}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {payment.ipnReceived && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              IPN ✓
                            </Badge>
                          )}
                          {payment.ipnValidated && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              Validated ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{payment.courseDetails?.title}</div>
                      {payment.isInstallment && (
                        <div className="text-xs text-blue-600 mt-1">
                          Installment {payment.installmentNumber}/{payment.totalInstallments}
                          {payment.installmentPlan && ` (${payment.installmentPlan})`}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatAmount(payment.amount)}</div>
                      {payment.couponCode && (
                        <div className="text-xs text-green-600 mt-1">
                          Coupon: {payment.couponCode}
                          {payment.couponDiscount && ` (-${formatAmount(payment.couponDiscount)})`}
                        </div>
                      )}
                      {payment.originalAmount && payment.originalAmount !== payment.amount && (
                        <div className="text-xs text-gray-500 line-through">
                          Original: {formatAmount(payment.originalAmount)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <div>
                          <div className="text-sm font-medium">
                            {payment.cardType || payment.paymentMethod || 'SSLCommerz'}
                          </div>
                          {payment.cardIssuer && (
                            <div className="text-xs text-gray-500">{payment.cardIssuer}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{getCheckingBadge(payment.checking)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(payment.createdAt), 'hh:mm a')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalItems)} of {pagination.totalItems} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPrevPage}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserPaymentHistory;
