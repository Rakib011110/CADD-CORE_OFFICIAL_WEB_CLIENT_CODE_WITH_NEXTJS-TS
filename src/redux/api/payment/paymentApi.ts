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
  }),
});

export const {
  useInitiatePaymentMutation,
  useHandleSuccessMutation,
  useHandleFailureMutation,
  useGetAllPaymentsQuery,
  useGetPaymentByIdQuery,
  useGetMyPaymentsQuery,
  useCreatePaymentMutation
} = paymentApi;

export default paymentApi;
