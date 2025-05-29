// src/redux/api/installmentPlanApi.ts
import baseApi from '@/redux/baseApi';

export const installmentPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstallmentPlans: builder.query({
      query: () => '/installment-plans',
      providesTags: ['InstallmentPlans'],
    }),
    createInstallmentPlan: builder.mutation({
      query: (data) => ({
        url: '/installment-plans',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['InstallmentPlans'],
    }),
    updateInstallmentPlan: builder.mutation({
      query: ({ name, ...data }) => ({
        url: `/installment-plans/${name}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['InstallmentPlans'],
    }),
    deleteInstallmentPlan: builder.mutation({
      query: (name) => ({
        url: `/installment-plans/${name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InstallmentPlans'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInstallmentPlansQuery,
  useCreateInstallmentPlanMutation,
  useUpdateInstallmentPlanMutation,
  useDeleteInstallmentPlanMutation,
} = installmentPlanApi;
