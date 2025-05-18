import baseApi from "@/redux/baseApi";

export const jobApplicationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    applyJob: builder.mutation({
      query: (body) => ({
        url: "/job-application",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Applications"],
    }),

    getAllJobApplications: builder.query({
      query: () => "/job-application",
      providesTags: ["Applications"],
    }),         

    getApplicationsByJobId: builder.query({
      query: (jobId: string) => `/job-application/job/${jobId}`,
      providesTags: ["Applications"],
    }),

    getSingleJobApplication: builder.query({
      query: (id: string) => `/job-application/single/${id}`,
      providesTags: ["Applications"],
    }),

    deleteJobApplication: builder.mutation({
      query: (id: string) => ({
        url: `/job-application/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Applications"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useApplyJobMutation,
  useGetAllJobApplicationsQuery,
  useGetApplicationsByJobIdQuery,
  useGetSingleJobApplicationQuery, 
  useDeleteJobApplicationMutation


} = jobApplicationApi;
