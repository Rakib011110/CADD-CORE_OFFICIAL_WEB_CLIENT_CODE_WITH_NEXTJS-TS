import baseApi from "../baseApi";

const seminarAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // `{ upcoming: true }` returns only seminars still to come, soonest first, for the website
    getAllSeminar: builder.query({
      query: (args?: { upcoming?: boolean }) => ({
        url: `/seminars`,
        method: "GET",
        params: args?.upcoming ? { upcoming: "true" } : undefined,
      }),
      providesTags: ["Seminar"],
    }),

    createSeminar: builder.mutation({
      query: (seminarData) => ({
        url: "/seminars/create-seminar",
        method: "POST",
        body: seminarData,
      }),
      invalidatesTags: ["Seminar"],
    }),

    updateseminar: builder.mutation({
      query: ({ id, seminarData }) => ({
        url: `/seminars/${id}`,
        method: "PATCH",
        body: seminarData,
      }),
      invalidatesTags: ["Seminar"],
    }),

    deleteseminar: builder.mutation({
      query: (id) => ({
        url: `/seminars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Seminar"],
    }),
  }),
});

export const { useGetAllSeminarQuery, useCreateSeminarMutation, useDeleteseminarMutation, useUpdateseminarMutation } = seminarAPi;
