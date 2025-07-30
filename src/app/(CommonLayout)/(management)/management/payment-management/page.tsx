"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Input } from '@/components/UI/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
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
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useGetAllPaymentsQuery, useUpdatePaymentMutation } from '@/redux/api/payment/paymentApi';
import { PaymentStats } from '@/components/pages/Payments/MANAGEPAYMENT/PaymentStats';
import { PaymentTable } from './PaymentTable';

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

interface FilterOptions {
  search: string;
  status: string;
  paymentMethod: string;
  dateRange: string;
}

// --------- Main Management Component ----------
const PaymentManagement = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    paymentMethod: 'all',
    dateRange: 'all'
  });

  const { data: paymentsData, isLoading, refetch } = useGetAllPaymentsQuery(undefined);
  const [markAsChecked, { isLoading: isMarkingChecked }] = useUpdatePaymentMutation();

  const payments: Payment[] = paymentsData?.data || [];

  // Calculate total amount for completed payments
  const totalCompletedAmount = useMemo(() => {
    return payments
      .filter((payment: Payment) => payment.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0);
  }, [payments]);

  // Filter payments based on search and filters
  const filteredPayments = useMemo(() => {
    let filtered = payments;

    // Tab filter
    if (activeTab === "recent") {
      filtered = filtered.filter((p: Payment) => !p.checking);
    } else if (activeTab === "success") {
      filtered = filtered.filter((p: Payment) => p.status === "completed");
    } else if (activeTab === "failed") {
      filtered = filtered.filter((p: Payment) => p.status === "failed");
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((payment: Payment) => 
        payment.user.name.toLowerCase().includes(searchLower) ||
        payment.user.email.toLowerCase().includes(searchLower) ||
        payment.transactionId.toLowerCase().includes(searchLower) ||
        payment.course.title.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((payment: Payment) => payment.status === filters.status);
    }

    // Payment method filter
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      filtered = filtered.filter((payment: Payment) => 
        payment.paymentMethod === filters.paymentMethod
      );
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          filterDate.setFullYear(1970);
      }
      
      filtered = filtered.filter((payment: Payment) => 
        new Date(payment.createdAt) >= filterDate
      );
    }

    return filtered;
  }, [payments, activeTab, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleMarkAsChecked = async (id: string) => {
    try {
      await markAsChecked({ id } as any).unwrap();
      toast.success("Payment marked as checked successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to mark payment as checked");
    }
  };

  const handleViewUserHistory = (userId: string) => {
    router.push(`/dashboard/payments/user-history/${userId}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      paymentMethod: 'all',
      dateRange: 'all'
    });
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">Manage and monitor all SSLCommerz transactions</p>
          
          {/* Total Completed Amount Display */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Total Completed Revenue:</span>
              <span className="text-lg font-bold text-green-900">
                ৳{totalCompletedAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <PaymentStats payments={payments} />

        {/* Filters Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, transaction ID..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Payment Method Filter */}
              <Select value={filters.paymentMethod} onValueChange={(value) => handleFilterChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bkash">bKash</SelectItem>
                  <SelectItem value="nagad">Nagad</SelectItem>
                  <SelectItem value="rocket">Rocket</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table with Tabs */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Payment Transactions</CardTitle>
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length} results
                </span>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="recent">
                  Recent ({payments.filter((p) => !p.checking).length})
                </TabsTrigger>
                <TabsTrigger value="success">
                  Success ({payments.filter((p) => p.status === "completed").length})
                </TabsTrigger>
                <TabsTrigger value="failed">
                  Failed ({payments.filter((p) => p.status === "failed").length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({payments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <PaymentTable
                  payments={paginatedPayments}
                  isLoading={isLoading}
                  onMarkChecked={handleMarkAsChecked}
                  onViewUserHistory={handleViewUserHistory}
                  isMarkingChecked={isMarkingChecked}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      
                      {/* Page numbers */}
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
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