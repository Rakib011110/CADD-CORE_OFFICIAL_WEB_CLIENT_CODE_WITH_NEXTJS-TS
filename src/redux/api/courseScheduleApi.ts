import baseApi from "../baseApi";

const courseScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all schedules
    getAllSchedules: builder.query({
      query: () => '/course-schedule',
    }),
    // Get a single schedule by ID
    getSchedule: builder.query({
      query: (id) => `/course-schedule/${id}`,
    }),
    // Create a new schedule
    createSchedule: builder.mutation({
      query: (data) => ({
        url: '/course-schedule',
        method: 'POST',
        body: data,
      }),
    }),
    // Update a schedule
    updateSchedule: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/course-schedule/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    // Delete a schedule
    deleteSchedule: builder.mutation({
      query: (id) => ({
        url: `/course-schedule/${id}`,
        method: 'DELETE',
      }),
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