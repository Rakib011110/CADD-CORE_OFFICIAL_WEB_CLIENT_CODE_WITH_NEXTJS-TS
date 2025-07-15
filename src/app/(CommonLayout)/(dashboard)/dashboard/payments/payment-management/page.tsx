"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/UI/table';
import { 
  Download, 
  Eye, 
  Check, 
  Clock,
  CreditCard,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetPaymentsWithFiltersQuery, useMarkPaymentAsCheckedMutation, useGetPaymentStatisticsQuery } from '@/redux/api/payment/paymentApi';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface Payment {
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
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  cardType?: string;
  paymentMethod?: string;
  checking: boolean;
  createdAt: string;
  updatedAt: string;
}

const PaymentManagement = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('recent'); // Default to recent

  const { data: paymentsData, isLoading, refetch } = useGetPaymentsWithFiltersQuery({
    page: currentPage,
    limit: 10
  });
  
  const { data: statsData } = useGetPaymentStatisticsQuery(undefined);
  const [markAsChecked, { isLoading: isMarkingChecked }] = useMarkPaymentAsCheckedMutation();

  const payments = paymentsData?.data?.payments || [];
  const pagination = paymentsData?.data?.pagination || {};
  const stats = statsData?.data || {};

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Filter payments based on active tab
  const filteredPayments = activeTab === 'recent' 
    ? payments.filter((payment: Payment) => !payment.checking)
    : payments;

  const handleMarkAsChecked = async (transactionId: string) => {
    try {
      await markAsChecked(transactionId).unwrap();
      toast.success('Payment marked as checked successfully!');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to mark payment as checked');
    }
  };

  const handleViewUserHistory = (userId: string) => {
    router.push(`/dashboard/payments/user-history/${userId}`);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100'}>
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
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">Manage and monitor all SSLCommerz transactions</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Payments"
            value={stats.totalPayments || 0}
            icon={CreditCard}
            color="text-blue-600"
          />
          <StatCard
            title="Total Amount"
            value={formatAmount(stats.totalAmount || 0)}
            icon={DollarSign}
            color="text-green-600"
          />
          <StatCard
            title="Completed"
            value={stats.completedPayments || 0}
            icon={Check}
            color="text-green-600"
          />
          <StatCard
            title="Pending Review"
            value={stats.uncheckedPayments || 0}
            icon={AlertCircle}
            color="text-orange-600"
          />
        </div>        {/* Payments Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Payment Transactions</CardTitle>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="recent">
                  Recent / New ({stats.uncheckedPayments || 0})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All Payments ({stats.totalPayments || 0})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[200px]">User Details</TableHead>
                            <TableHead className="min-w-[180px]">Course</TableHead>
                            <TableHead className="min-w-[140px]">Transaction ID</TableHead>
                            <TableHead className="min-w-[100px]">Amount</TableHead>
                            <TableHead className="min-w-[100px]">Method</TableHead>
                            <TableHead className="min-w-[100px]">Status</TableHead>
                            <TableHead className="min-w-[120px]">Date</TableHead>
                            <TableHead className="min-w-[100px]">Review</TableHead>
                            <TableHead className="min-w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPayments.map((payment: Payment) => (
                            <TableRow key={payment._id}>
                              <TableCell className="max-w-[200px]">
                                <div className="truncate">
                                  <div className="font-medium truncate">{payment.user?.name}</div>
                                  <div className="text-sm text-gray-500 truncate">{payment.user?.email}</div>
                                  <div className="text-sm text-gray-500 truncate">{payment.user?.mobileNumber}</div>
                                </div>
                              </TableCell>
                              <TableCell className="max-w-[180px]">
                                <div className="font-medium truncate">{payment.course?.title}</div>
                              </TableCell>
                              <TableCell className="max-w-[140px]">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded block truncate">
                                  {payment.transactionId}
                                </code>
                              </TableCell>
                              <TableCell className="max-w-[100px]">
                                <div className="font-medium text-sm">{formatAmount(payment.amount)}</div>
                              </TableCell>
                              <TableCell className="max-w-[100px]">
                                <div className="flex items-center gap-1">
                                  <CreditCard className="w-4 h-4" />
                                  <span className="text-sm truncate">
                                    {payment.cardType || payment.paymentMethod || 'SSL'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="max-w-[100px]">{getStatusBadge(payment.status)}</TableCell>
                              <TableCell className="max-w-[120px]">
                                <div className="text-sm">
                                  {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {format(new Date(payment.createdAt), 'hh:mm a')}
                                </div>
                              </TableCell>
                              <TableCell className="max-w-[100px]">{getCheckingBadge(payment.checking)}</TableCell>
                              <TableCell className="max-w-[120px]">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewUserHistory(payment.user?._id)}
                                    className="p-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {!payment.checking && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleMarkAsChecked(payment.transactionId)}
                                      disabled={isMarkingChecked}
                                      className="p-2"
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
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
                          <span className="text-sm px-3">
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
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentManagement;
