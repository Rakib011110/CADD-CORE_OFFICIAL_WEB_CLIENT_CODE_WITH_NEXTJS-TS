import baseApi from "../baseApi";


export const UserApi = baseApi.injectEndpoints({

endpoints: (builder)=>({

    getAllUsers: builder.query({
        query: () => ({
          url: `/users`,
          method: "GET",
        //   headers: {
        //     Authorization: `${Cookies.get("accesToken")}`,
        //   },
        }),
        providesTags: ["User"],
      }), 


      
      
        createUsers: builder.mutation({
            query: (eventData) => ({
              url: "/users",
              method: "POST",
              body: eventData,
            }),
            invalidatesTags: ["Event"],
          }), 
    
    
    
          updateusers: builder.mutation({
            query: ({ id, usersData }) => ({
              url: `/users/${id}`,
              method: "PUT",
              body: usersData,
            }),
            invalidatesTags: ["User"],
          }), 
      
          deleteusers: builder.mutation({
            query: (id) => ({
              url: `/users/${id}`,
              method: "DELETE",
            }),
            invalidatesTags: ["User"],
          }),
    
})


})
export const {
    useGetAllUsersQuery,
  useCreateUsersMutation, 
  useUpdateusersMutation,  
  useDeleteusersMutation
  } = UserApi;