// src/redux/api/jobApi.ts

import baseApi from "@/redux/baseApi";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobs: builder.query({
      query: () => "/jobs",
      providesTags: ["Jobs"],

    }),
    getSingleJobBySlug: builder.query({
      query: (slug: string) => `/jobs/${slug}`,
      providesTags: ["Jobs"],

    }),
    createJob: builder.mutation({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Jobs"],
    }),
    deleteJob: builder.mutation({
      query: (id: string) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],

    }),
    updateJob: builder.mutation({
      query: ({ id, data }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Jobs"],
    }),
    
  }),
});

export const {
  useGetAllJobsQuery,
  useGetSingleJobBySlugQuery,
  useCreateJobMutation,
  useDeleteJobMutation,
  useUpdateJobMutation
} = jobApi;
