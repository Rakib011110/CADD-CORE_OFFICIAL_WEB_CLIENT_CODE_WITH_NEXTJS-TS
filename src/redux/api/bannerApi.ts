import baseApi from "../baseApi";

export interface IBannerItem {
  _id: string;
  title?: string;
  photoUrl: string;
  link?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBanners: builder.query<{ success: boolean; data: IBannerItem[] }, Record<string, any> | void>({
      query: () => ({
        url: "/banners",
        method: "GET",
      }),
      providesTags: ["Banner"],
    }),

    createBanner: builder.mutation<{ success: boolean; data: IBannerItem }, Partial<IBannerItem>>({
      query: (bannerData) => ({
        url: "/banners",
        method: "POST",
        body: bannerData,
      }),
      invalidatesTags: ["Banner"],
    }),

    updateBanner: builder.mutation<{ success: boolean; data: IBannerItem }, { id: string; data: Partial<IBannerItem> }>({
      query: ({ id, data }) => ({
        url: `/banners/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Banner"],
    }),

    deleteBanner: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
