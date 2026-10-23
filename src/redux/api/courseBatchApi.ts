import baseApi from "../baseApi";

// Batches (online, offline, weekend, friday, corporate, one-to-one) managed from the dashboard.
// Changes also refresh course pages, which show the published batches.
const courseBatchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCourseBatches: builder.query({
      query: (courseId?: string) => ({
        url: "/course-batches",
        params: courseId ? { course: courseId } : undefined,
      }),
      providesTags: ["CourseBatch"],
    }),
    createCourseBatch: builder.mutation({
      query: (data) => ({ url: "/course-batches", method: "POST", body: data }),
      invalidatesTags: ["CourseBatch", "Course"],
    }),
    updateCourseBatch: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/course-batches/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["CourseBatch", "Course"],
    }),
    deleteCourseBatch: builder.mutation({
      query: (id: string) => ({ url: `/course-batches/${id}`, method: "DELETE" }),
      invalidatesTags: ["CourseBatch", "Course"],
    }),
  }),
});

export const {
  useGetAllCourseBatchesQuery,
  useCreateCourseBatchMutation,
  useUpdateCourseBatchMutation,
  useDeleteCourseBatchMutation,
} = courseBatchApi;
export default courseBatchApi;
