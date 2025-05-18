import baseApi from "../baseApi";


export const indrustrialcourseApi = baseApi.injectEndpoints({

endpoints: (builder)=>({
    getAllIndrustrialCourse: builder.query({
        query: () => ({
          url: `/industrial-Courses`,
          method: "GET",
       
        }),
        providesTags: ["Course"],
      }),


  getIndrustrialCourseBySlug: builder.query({
    query: (slug) => ({
      url: `/industrial-courses/${slug}`, 
      method: "GET",
    }),
    providesTags: ["Course"],
  }),

      createIndrustrialCourse: builder.mutation({
        query: (courseData) => ({
          url: "/industrial-courses/create-course",
          method: "POST",
          body: courseData,
        }),
        invalidatesTags: ["Course"],
      }),

      deleteIndrustrialCourse: builder.mutation({
        query: (id) => ({
          url: `/industrial-courses/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Course"],
      }),

      updateIndrustrialCourse: builder.mutation({
        query: ({ id, courseData }) => ({
          url: `/industrial-courses/${id}`,
          method: "PUT",
          body: courseData,
        }),
        invalidatesTags: ["Course"],
      }),
})


})
export const {
    useGetAllIndrustrialCourseQuery,
    useGetIndrustrialCourseBySlugQuery,
    useCreateIndrustrialCourseMutation,
    useDeleteIndrustrialCourseMutation,
    useUpdateIndrustrialCourseMutation,
  } = indrustrialcourseApi;

