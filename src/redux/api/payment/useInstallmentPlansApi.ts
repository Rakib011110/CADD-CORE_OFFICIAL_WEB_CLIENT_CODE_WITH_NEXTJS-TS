// src/redux/api/installmentPlanApi.ts
import baseApi from '@/redux/baseApi';

export const installmentPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstallmentPlans: builder.query({
      // `{ all: true }` also returns inactive plans (dashboard)
      query: (args?: { all?: boolean }) => (args?.all ? '/installment-plans?all=true' : '/installment-plans'),
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
      // `originalName` finds the saved plan; `name` may be a new name
      query: ({ originalName, name, ...data }) => ({
        url: `/installment-plans/${encodeURIComponent(originalName ?? name)}`,
        method: 'PUT',
        body: originalName ? { name, ...data } : data,
      }),
      invalidatesTags: ['InstallmentPlans'],
    }),
    deleteInstallmentPlan: builder.mutation({
      query: (name) => ({
        url: `/installment-plans/${encodeURIComponent(name)}`,
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
