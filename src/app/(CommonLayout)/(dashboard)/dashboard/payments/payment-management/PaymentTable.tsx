"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import {
  Download,
  Eye,
  Check,
  Clock,
  CreditCard,
  DollarSign,
  AlertCircle,
  XCircle,
  Copy,
  User,
  FileText,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import {
  useUpdatePaymentMutation,
  useGetAllPaymentsQuery,
} from "@/redux/api/payment/paymentApi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/UI/tooltip";

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
  status: "pending" | "completed" | "failed" | "cancelled" | "refund";
  cardType?: string;
  paymentMethod?: string;
  checking: boolean;
  createdAt: string;
  updatedAt: string;
}

// --------- Payment Status Update Component ----------
const PaymentStatusUpdate = ({ 
  payment, 
  onStatusUpdate, 
  isUpdating 
}: { 
  payment: Payment; 
  onStatusUpdate: (paymentId: string, newStatus: Payment["status"]) => void;
  isUpdating: boolean;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Payment["status"]>(payment.status);

  const handleStatusChange = (newStatus: Payment["status"]) => {
    setSelectedStatus(newStatus);
    onStatusUpdate(payment._id, newStatus);
  };

  return (
    <Select 
      value={selectedStatus} 
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-32 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="failed">Failed</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
        <SelectItem value="refund">Refund</SelectItem>
      </SelectContent>
    </Select>
  );
};

// --------- Table Section Component ----------
export const PaymentTable = ({
  payments,
  isLoading,
  onMarkChecked,
  onViewPaymentDetails,
  onViewUserHistory,
  onStatusUpdate,
  isMarkingChecked,
  isUpdatingStatus,
}: {
  payments: Payment[];
  isLoading: boolean;
  onMarkChecked: (id: string) => void;
  onViewPaymentDetails: (paymentId: string) => void;
  onViewUserHistory: (userId: string) => void;
  onStatusUpdate: (paymentId: string, newStatus: string) => void;
  isMarkingChecked: boolean;
  isUpdatingStatus: boolean;
}) => {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
      refund: "bg-purple-100 text-purple-800",
    };
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100"}>
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
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <div className="w-full">
      <TooltipProvider>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900 min-w-[200px]">User Details</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[180px]">Course</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[140px]">Transaction ID</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[100px]">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[100px]">Method</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[100px]">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[140px]">Status Update</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[120px]">Date</TableHead>
                  <TableHead className="font-semibold text-gray-900 min-w-[100px]">Review</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center min-w-[140px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500">Loading payments...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-gray-500 font-medium">No payments found</span>
                      <span className="text-gray-400 text-sm">Try adjusting your filters</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment, index) => (
                  <TableRow key={payment._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => handleCopy(payment.user?.name || "")}
                              >
                                {payment.user?.name?.split(" ").slice(0, 2).join(" ")}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Click to copy: {payment.user?.name}
                            </TooltipContent>
                          </Tooltip>
                          <Copy 
                            className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" 
                            onClick={() => handleCopy(payment.user?.name || "")} 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="text-sm text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => handleCopy(payment.user?.email || "")}
                              >
                                {payment.user?.email}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Click to copy: {payment.user?.email}
                            </TooltipContent>
                          </Tooltip>
                          <Copy 
                            className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" 
                            onClick={() => handleCopy(payment.user?.email || "")} 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="text-sm text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => handleCopy(payment.user?.mobileNumber || "")}
                              >
                                {payment.user?.mobileNumber}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Click to copy: {payment.user?.mobileNumber}
                            </TooltipContent>
                          </Tooltip>
                          <Copy 
                            className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" 
                            onClick={() => handleCopy(payment.user?.mobileNumber || "")} 
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="font-medium cursor-pointer hover:text-blue-600 transition-colors max-w-[150px] truncate"
                              onClick={() => handleCopy(payment.course?.title || "")}
                            >
                              {payment.course?.title}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Click to copy: {payment.course?.title}
                          </TooltipContent>
                        </Tooltip>
                        <Copy 
                          className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" 
                          onClick={() => handleCopy(payment.course?.title || "")} 
                        />
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <code
                              className="text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                              onClick={() => handleCopy(payment.transactionId)}
                            >
                              {payment.transactionId.slice(0, 12)}...
                            </code>
                          </TooltipTrigger>
                          <TooltipContent>
                            Click to copy: {payment.transactionId}
                          </TooltipContent>
                        </Tooltip>
                        <Copy 
                          className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" 
                          onClick={() => handleCopy(payment.transactionId)} 
                        />
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="font-semibold text-green-600">
                        {formatAmount(payment.amount)}
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {payment.cardType || payment.paymentMethod || "SSL"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      {getStatusBadge(payment.status)}
                    </TableCell>

                    <TableCell className="py-4">
                      <PaymentStatusUpdate 
                        payment={payment} 
                        onStatusUpdate={onStatusUpdate}
                        isUpdating={isUpdatingStatus}
                      />
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(payment.createdAt), "hh:mm a")}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                      {getCheckingBadge(payment.checking)}
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => onViewPaymentDetails(payment._id)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
                            >
                              <FileText className="w-6 h-6" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            View Payment Details
                          </TooltipContent>
                        </Tooltip>
                        
                      

                       
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};
