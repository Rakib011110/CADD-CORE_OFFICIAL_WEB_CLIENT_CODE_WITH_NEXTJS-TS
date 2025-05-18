import { create } from "domain";
import baseApi from "../baseApi";

export const partnesApi= baseApi.injectEndpoints({
    endpoints:(builder)=>({
createPartner: builder.mutation({
    query: (partnerData) => ({
      url: "/partners",
      method: "POST",
      body: partnerData,
    }),
    invalidatesTags: ["Partner"],
  }),
  
  getPartners: builder.query({
    query: () => ({
      url: "/partners",
      method: "GET",
    }),
    providesTags: ["Partner"],
  }),

   
  updatePartner: builder.mutation({
    query: ({ id, ...updatedData }) => ({
      url: `/partners/${id}`,
      method: "PUT",
      body: updatedData,
    }),
    invalidatesTags: ["Partner"],
  }),
  
  deletePartner: builder.mutation({
    query: (id) => ({
      url: `/partners/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Partner"],
  }),
   


    })

})



export const { useGetPartnersQuery,useCreatePartnerMutation,useUpdatePartnerMutation,useDeletePartnerMutation}= partnesApi

