// src/redux/api/payment/paymentStatusApi.ts
import baseApi from '../../baseApi';

export const paymentStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentStatus: builder.query<any, string>({
      query: (transactionId) => ({
        url: `/payments/status/${transactionId}`,
        method: 'GET',
      }),
      providesTags: ['Payment'],
    }),
    


    

    verifyPayment: builder.mutation<any, { transactionId: string; val_id?: string }>({
      query: ({ transactionId, val_id }) => ({
        url: `/payments/verify/${transactionId}`,
        method: 'POST',
        body: { val_id },
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const { 
  useGetPaymentStatusQuery, 
  useVerifyPaymentMutation,
  useLazyGetPaymentStatusQuery
} = paymentStatusApi;
