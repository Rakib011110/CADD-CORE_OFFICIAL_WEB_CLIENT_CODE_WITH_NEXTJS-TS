
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//  // baseUrl: "https://caddcore-web-server-code-pi.vercel.app/api", old APi 
const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:5000/api",
   
    baseUrl: "https://caddcoreapi-ten.vercel.app/api",
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
    "Coupon"
  ],
  endpoints: () => ({})
});

export default baseApi;