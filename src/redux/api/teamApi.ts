import baseApi from "../baseApi";

export const TeamApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getAllTeam: builder.query({
        query: () => ({
          url: "/team",
          method: "GET",
        }),
        providesTags: ["Team"],
      }),
  
      getTeamById: builder.query({
        query: (id) => ({
          url: `/team/${id}`,
          method: "GET",
        }),
        providesTags: ["Team"],
      }),
  
      createTeam: builder.mutation({
        query: (TeamData) => ({
          url: "/team/create-team",
          method: "POST",
          body: TeamData,
        }),
        invalidatesTags: ["Team"],
      }),
  
      updateTeam: builder.mutation({
        query: ({ id, TeamData }) => ({
          url: `/team/${id}`,
          method: "PUT",
          body: TeamData,
        }),
        invalidatesTags: ["Team"],
      }),
  
      deleteTeam: builder.mutation({
        query: (id) => ({
          url: `/team/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Team"],
      }),
    }),
  });
  
  export const {
    useGetAllTeamQuery,
    useGetTeamByIdQuery,
    useCreateTeamMutation,
    useUpdateTeamMutation,
    useDeleteTeamMutation,
  } = TeamApi;
  