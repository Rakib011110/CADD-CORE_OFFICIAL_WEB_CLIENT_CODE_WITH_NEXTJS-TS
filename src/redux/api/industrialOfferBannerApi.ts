import baseApi from "../baseApi";

export const industrialOfferBannerApi= baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllindustrialOfferBanner: builder.query({
          query: () => ({
            url: "/industrial-offer-banner",
            method: "GET",
          }),
          providesTags: ["industrial"],
        }),
    
    
        createIndustrialOfferBanner: builder.mutation({
          query: (industrialData) => ({
            url: "/industrial-offer-banner",
            method: "POST",
            body: industrialData,
          }),
          invalidatesTags: ["industrial"],
        }),
    
        updateIndustrialOfferBanner: builder.mutation({
          query: ({ id, industrialData }) => ({
            url: `/industrial-offer-banner/${id}`,
            method: "PATCH",
            body: industrialData,
          }),
          invalidatesTags: ["industrial"],
        }),
    
        deleteIndustrialOfferBanner: builder.mutation({
          query: (id) => ({
            url: `/industrial-offer-banner/${id}`,
            method: "DELETE",
          }),
          invalidatesTags: ["industrial"],
        }),

// -------here is only Banner not offer Banner---------------



        getAllindustrialBanner: builder.query({
          query: () => ({
            url: "/industrial-banner",
            method: "GET",
          }),
          providesTags: ["industrial"],
        }),
        
        
        createIndustrialBanner: builder.mutation({
          query: (industrialData) => ({
            url: "/industrial-banner",
            method: "POST",
            body: industrialData,
          }),
          invalidatesTags: ["industrial"],
        }),
        
        updateIndustrialBanner: builder.mutation({
          query: ({ id, industrialData }) => ({
            url: `/industrial-banner/${id}`,
            method: "PATCH",
            body: industrialData,
          }),
          invalidatesTags: ["industrial"],
        }),
        
        deleteIndustrialBanner: builder.mutation({
          query: (id) => ({
            url: `/industrial-banner/${id}`,
            method: "DELETE",
          }),
          invalidatesTags: ["industrial"],
        }),
        

      }),


}) 

export const {useGetAllindustrialOfferBannerQuery, useCreateIndustrialOfferBannerMutation, useUpdateIndustrialOfferBannerMutation, useDeleteIndustrialOfferBannerMutation ,
// only Banner
  useGetAllindustrialBannerQuery, 
  useCreateIndustrialBannerMutation, 
  useDeleteIndustrialBannerMutation

} = industrialOfferBannerApi