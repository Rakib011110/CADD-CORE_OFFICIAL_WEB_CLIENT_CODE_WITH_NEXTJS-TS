
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/lib/apiBase";

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    // Send the logged-in user's token so the API can check admin/staff access
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Event",
    "Course", 
    "Seminar", 
    "Team", 
    "Certificate",
    "Review", 
    "Partner",
    "CertificatesApplication", 
    "industrial",
    "Jobs",
    "Applications", 
    "Coupon","InstallmentPlans",
    "CourseSchedule",
    "Payment",
    "Banner",
    "CourseBatch"
  ],
  endpoints: () => ({})
});

export default baseApi;