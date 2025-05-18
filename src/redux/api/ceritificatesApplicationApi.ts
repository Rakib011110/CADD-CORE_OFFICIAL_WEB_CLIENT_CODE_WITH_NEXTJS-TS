// src/redux/api/certificateApi.ts

import { CertificateApplication } from "@/types";
import baseApi from "../baseApi";

export const certificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Search applications by student ID
    getStudentApplications: builder.query<{ data: CertificateApplication[] },
      string
    >({
      query: (studentId) => `/certificates/student/${studentId}`,
      providesTags: (_result, _error, studentId) => [
        { type: "CertificatesApplication", id: studentId },
      ],
    }),

    // 2. Apply for certificate
    applyCertificate: builder.mutation<
      CertificateApplication,
      { studentId: string; courseName: string; studentName: string }
    >({
      query: (body) => ({
        url: `/certificates/apply`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { studentId }) => [
        { type: "CertificatesApplication", id: studentId },
        "CertificatesApplication",
      ],
    }),

    // 3. Admin: get all applications
    getAllApplications: builder.query<{data: CertificateApplication[]}, void>({
      query: () => `/certificates`,
      providesTags: ["CertificatesApplication"],
    }),

    // 4. Admin: approve one
    approveApplication: builder.mutation<
      CertificateApplication,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/certificates/approve/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["CertificatesApplication"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStudentApplicationsQuery,
  useApplyCertificateMutation,
  useGetAllApplicationsQuery,
  useApproveApplicationMutation,
} = certificateApi;

