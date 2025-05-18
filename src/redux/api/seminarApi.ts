import baseApi from "../baseApi";

const seminarAPi = baseApi.injectEndpoints({
endpoints: (builder)=>({
    getAllSeminar: builder.query({  
        query: () => ({  

            url: `/seminars`,  
            method: "GET",
         }),
         providesTags: ["Seminar"], 
    }), 

    createSeminar: builder.mutation({
        query: (eventData) => ({
          url: "/seminars/create-seminar",
          method: "POST",
          body: eventData,
        }),
        invalidatesTags: ["Event"],
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



}) 
}) 



export const { useGetAllSeminarQuery, useCreateSeminarMutation, useDeleteseminarMutation,useUpdateseminarMutation } = seminarAPi; 