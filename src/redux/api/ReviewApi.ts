import baseApi from "../baseApi";

export const ReviewsApi = baseApi.injectEndpoints({
 
  endpoints: (builder) => ({
createReview: builder.mutation({    
    query: (data) => ({
      url: "/reviews",
      method: "POST",
      body: data,
    }),
    invalidatesTags: ["Review"],
  }),

getAllReviews: builder.query({
    query: () => ({
      url: "/reviews",
      method: "GET",
    }),
    providesTags: ["Review"],
  }),

deleteReview: builder.mutation({
    query: (id) => ({
      url: `/reviews/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Review"],
  }),

getReviewById: builder.query({
    query: (id) => ({
      url: `/reviews/${id}`,
      method: "GET",
    }),
    providesTags: ["Review"],
  }),

updateReview: builder.mutation({
    query: ({ id, data }) => ({
      url: `/reviews/${id}`,
      method: "PUT",
      body: data,
    }),
    invalidatesTags: ["Review"],
  }),



}),
})

export const {
  useCreateReviewMutation,
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
} = ReviewsApi;