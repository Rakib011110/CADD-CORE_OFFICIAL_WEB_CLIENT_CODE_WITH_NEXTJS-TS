import baseApi from "../baseApi";

const courseScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all schedules
    getAllSchedules: builder.query({
      query: () => '/course-schedule',
      providesTags: ["CourseSchedule"],
    }),
    // Get a single schedule by ID
    getSchedule: builder.query({
      query: (id) => `/course-schedule/${id}`,
      providesTags: ["CourseSchedule"],
    }),
    // Create a new schedule
    createSchedule: builder.mutation({
      query: (data) => ({
        url: '/course-schedule',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ["CourseSchedule"],
    }),
    // Update a schedule
    updateSchedule: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/course-schedule/${id}`,
        method: 'PUT',
        body: data,
      }),
       invalidatesTags: ["CourseSchedule"],
    }),
    // Delete a schedule
    deleteSchedule: builder.mutation({
      query: (id) => ({
        url: `/course-schedule/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ["CourseSchedule"],
    }),
  }),
});

export const {
  useGetAllSchedulesQuery,
  useGetScheduleQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = courseScheduleApi;
export default courseScheduleApi;
export const { endpoints: courseScheduleEndpoints } = courseScheduleApi;