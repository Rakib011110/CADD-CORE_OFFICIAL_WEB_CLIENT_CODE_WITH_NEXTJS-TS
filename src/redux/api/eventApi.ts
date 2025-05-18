import baseApi from "../baseApi";

export const EventApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getAllEvents: builder.query({
        query: () => ({
          url: "/events",
          method: "GET",
        }),
        providesTags: ["Event"],
      }),
  
      getEventById: builder.query({
        query: (id) => ({
          url: `/events/${id}`,
          method: "GET",
        }),
        providesTags: ["Event"],
      }),
  
      createEvent: builder.mutation({
        query: (eventData) => ({
          url: "/events/create-events",
          method: "POST",
          body: eventData,
        }),
        invalidatesTags: ["Event"],
      }),
  
      updateEvent: builder.mutation({
        query: ({ id, eventData }) => ({
          url: `/events/${id}`,
          method: "PATCH",
          body: eventData,
        }),
        invalidatesTags: ["Event"],
      }),
  
      deleteEvent: builder.mutation({
        query: (id) => ({
          url: `/events/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Event"],
      }),
    }),
  });
  
  export const {
    useGetAllEventsQuery,
    useGetEventByIdQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
  } = EventApi;
  