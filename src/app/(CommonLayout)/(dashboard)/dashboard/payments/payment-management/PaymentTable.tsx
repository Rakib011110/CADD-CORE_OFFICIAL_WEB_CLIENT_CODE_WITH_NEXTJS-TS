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
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
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
  status: "pending" | "completed" | "failed" | "cancelled";
  cardType?: string;
  paymentMethod?: string;
  checking: boolean;
  createdAt: string;
  updatedAt: string;
}

// --------- Table Section Component ----------
export const PaymentTable = ({
  payments,
  isLoading,
  onMarkChecked,
  onViewUserHistory,
  isMarkingChecked,
}: {
  payments: Payment[];
  isLoading: boolean;
  onMarkChecked: (id: string) => void;
  onViewUserHistory: (userId: string) => void;
  isMarkingChecked: boolean;
}) => {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="font-medium truncate cursor-pointer"
                              onClick={() => handleCopy(payment.user?.name || "")}
                            >
                              {payment.user?.name?.split(" ").slice(0, 2).join(" ")}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Click to copy name
                          </TooltipContent>
                        </Tooltip>
                        <Copy className="w-4 h-4 cursor-pointer" onClick={() => handleCopy(payment.user?.name || "")} />
                      </div>
                      <div className="text-sm text-gray-500 truncate flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="truncate cursor-pointer"
                              onClick={() => handleCopy(payment.user?.email || "")}
                            >
                              {payment.user?.email}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Click to copy email
                          </TooltipContent>
                        </Tooltip>
                        <Copy className="w-4 h-4 cursor-pointer" onClick={() => handleCopy(payment.user?.email || "")} />
                      </div>
                      <div className="text-sm text-gray-500 truncate flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className="truncate cursor-pointer"
                              onClick={() => handleCopy(payment.user?.mobileNumber || "")}
                            >
                              {payment.user?.mobileNumber}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Click to copy mobile number
                          </TooltipContent>
                        </Tooltip>
                        <Copy className="w-4 h-4 cursor-pointer" onClick={() => handleCopy(payment.user?.mobileNumber || "")} />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px] flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className="font-medium truncate cursor-pointer"
                            onClick={() => handleCopy(payment.course?.title || "")}
                          >
                            {payment.course?.title?.length > 18
                              ? payment.course?.title.slice(0, 18) + "..."
                              : payment.course?.title}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          Click to copy course title
                        </TooltipContent>
                      </Tooltip>
                      <Copy className="w-4 h-4 cursor-pointer ml-1" onClick={() => handleCopy(payment.course?.title || "")} />
                    </TableCell>



 <TableCell className="max-w-[140px] flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <code
                            className="text-xs bg-gray-100 px-2 py-1 rounded block truncate cursor-pointer"
                            onClick={() => handleCopy(payment.transactionId)}
                          >
                            {payment.transactionId.slice(0, 8)}...
                          </code>
                        </TooltipTrigger>
                        <TooltipContent>
                          Click to copy Transaction ID {payment.transactionId}
                        </TooltipContent>
                      </Tooltip>
                      <Copy className="w-4 h-4 cursor-pointer" onClick={() => handleCopy(payment.transactionId)} />
                    </TableCell>
                   
                    <TableCell className="max-w-[100px]">
                      <div className="font-medium text-sm">{formatAmount(payment.amount)}</div>
                    </TableCell>
                    <TableCell className="max-w-[100px]">
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm truncate">
                          {payment.cardType || payment.paymentMethod || "SSL"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[100px]">{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="max-w-[120px]">
                      <div className="text-sm">
                        {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(payment.createdAt), "hh:mm a")}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[100px]">{getCheckingBadge(payment.checking)}</TableCell>
                    <TableCell className="max-w-[120px]">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewUserHistory(payment.user?._id)}
                          className="p-2"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!payment.checking && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMarkChecked(payment._id)}
                            disabled={isMarkingChecked}
                            className="p-2"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>
    </div>
  );
};
