import baseApi from "@/redux/baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),
    getAllCoupons: builder.query({
      query: () => ({
        url: "/coupons",
        method: "GET",
      }),
      providesTags: ["Coupon"],
    }),
    deleteCoupon: builder.mutation({
      query: (code) => ({
        url: `/coupons/${code}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: "/coupons/validate",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});
export const {
  useCreateCouponMutation,
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
  useValidateCouponMutation,
} = couponApi;