// src/redux/features/payment/paymentApi.ts

import baseApi from "@/redux/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initiatePayment: builder.mutation({
      query: (data) => ({
        url: "/payments/initiate",
        method: "POST",
        body: data,
      }),
    }),
 createPayment: builder.mutation({
      query: (data) => ({
        url: "/payments/initiate",
        method: "POST",
        body: data,
      }),
    }),
    // Payment success (called by SSLCommerz)
    handleSuccess: builder.mutation({
      query: (transactionId) => ({
        url: `/payments/success/${transactionId}`,
        method: "POST",
      }),
    }),

    // Payment failed (called by SSLCommerz)
    handleFailure: builder.mutation({
      query: (transactionId) => ({
        url: `/payments/fail/${transactionId}`,
        method: "POST",
      }),
    }),

    // Admin: Get all payments
    getAllPayments: builder.query({
      query: () => "/payments",
    }),

    // Admin: Get single payment by ID
    getPaymentById: builder.query({
      query: (id: string) => `/payments/${id}`,
    }),

    // User: Get payments for a user
    getMyPayments: builder.query({
      query: (userId: string) => `/payments/my-payments/${userId}`,
    }),

    // 🔧 Admin: Get payments with simple pagination
    getPaymentsWithFilters: builder.query({
      query: ({ page = 1, limit = 10 }) => 
        `/payments/admin/payments?page=${page}&limit=${limit}`,
    }),

    // 🔧 Admin: Mark payment as checked
    markPaymentAsChecked: builder.mutation({
      query: (transactionId: string) => ({
        url: `/payments/admin/mark-checked/${transactionId}`,
        method: 'PUT',
      }),
    }),

    // 🔧 Admin: Get user payment history (simple)
    getUserPaymentHistory: builder.query({
      query: ({ userId, page = 1, limit = 10 }) => 
        `/payments/admin/user-history/${userId}?page=${page}&limit=${limit}`,
    }),

    // 🔧 Admin: Get payment statistics (simple)
    getPaymentStatistics: builder.query({
      query: () => `/payments/admin/statistics`,
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useHandleSuccessMutation,
  useHandleFailureMutation,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetMyPaymentsQuery,
  useCreatePaymentMutation,
  // Admin hooks
  useGetPaymentsWithFiltersQuery,
  useMarkPaymentAsCheckedMutation,
  useGetUserPaymentHistoryQuery,
  useGetPaymentStatisticsQuery,
} = paymentApi;


export default paymentApi;
