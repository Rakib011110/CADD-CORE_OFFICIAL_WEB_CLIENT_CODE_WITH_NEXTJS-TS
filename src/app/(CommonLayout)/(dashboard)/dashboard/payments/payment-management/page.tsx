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


// --------- Main Management Component ----------
const PaymentManagement = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("recent");
  const { data: paymentsData, isLoading, refetch } = useGetAllPaymentsQuery(undefined);
  const [markAsChecked, { isLoading: isMarkingChecked }] = useUpdatePaymentMutation();

  const payments: Payment[] = paymentsData?.data || [];

  // Tab filter logic
  const filteredPayments =
    activeTab === "recent"
      ? payments.filter((p: Payment) => !p.checking)
      : activeTab === "success"
      ? payments.filter((p: Payment) => p.status === "completed")
      : activeTab === "failed"
      ? payments.filter((p: Payment) => p.status === "failed")
      : payments;

  const handleTabChange = (value: string) => setActiveTab(value);

  const handleMarkAsChecked = async (id: string) => {
    try {
      await markAsChecked({ id  } as any).unwrap();
      toast.success("Payment marked as checked successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to mark payment as checked");
    }
  };

  const handleViewUserHistory = (userId: string) => {
    router.push(`/dashboard/payments/user-history/${userId}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">Manage and monitor all SSLCommerz transactions</p>
        </div>

        {/* Statistics Cards */}
        <PaymentStats payments={payments} />

        {/* Payments Table with Tabs */}
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
                  payments={filteredPayments}
                  isLoading={isLoading}
                  onMarkChecked={handleMarkAsChecked}
                  onViewUserHistory={handleViewUserHistory}
                  isMarkingChecked={isMarkingChecked}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentManagement;