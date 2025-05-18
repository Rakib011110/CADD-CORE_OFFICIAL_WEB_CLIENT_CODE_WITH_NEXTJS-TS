import baseApi from "@/redux/baseApi";

export const instructorHireApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all instructor applications
    getAllInstructorHire: builder.query({
      query: () => "/instructorHire",
      providesTags: ["Jobs"],
    }),

    // Get single instructor application
    getSingleInstructorHire: builder.query({
      query: (id) => `/instructorHire/${id}`,
      providesTags: (result, error, id) => [{ type: "Jobs", id }],
    }),

    // Create new instructor application
    createInstructorHire: builder.mutation({
      query: (data) => ({
        url: "/instructorHire",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Jobs"],
    }),

    // Update instructor application
    updateInstructorHire: builder.mutation({
      query: ({ id, data }) => ({
        url: `/instructorHire/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Jobs", id },
        "Jobs",
      ],
    }),

    // Delete instructor application
    deleteInstructorHire: builder.mutation({
      query: (id) => ({
        url: `/instructorHire/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Jobs", id },
        "Jobs",
      ],
    }),

    // Review instructor application
    reviewInstructorHire: builder.mutation({
      query: ({ id, data }) => ({
        url: `/instructorHire/${id}/review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Jobs", id },
        "Jobs",
      ],
    }),
  }),
});

export const {
  useGetAllInstructorHireQuery,
  useGetSingleInstructorHireQuery,
  useCreateInstructorHireMutation,
  useUpdateInstructorHireMutation,
  useDeleteInstructorHireMutation,
  useReviewInstructorHireMutation,
} = instructorHireApi;