import baseApi from "../baseApi";

export const UserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getAllCertificates: builder.query({
      query: () => "/certificates", 
        providesTags: ["Certificate"],
    }),

    getCertificateById: builder.query({
      query: (id) => `/certificates/${id}`,
      providesTags: ["Certificate"],

    }),

    getCertificatesByStudentId: builder.query({
      query: (studentId) => `/certificates/student/${studentId}`,
      providesTags: ["Certificate"],

    }),

    createCertificate: builder.mutation({
      query: (data) => ({
        url: "/certificates",
        method: "POST",
        body: data,
      }),
        invalidatesTags: ["Certificate"],
    }),




    deleteCertificates: builder.mutation({
        query: (id) => ({
          url: `/certificates/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Certificate"],
      }),


    updateCertificate: builder.mutation({
      query: ({ id, data }) => ({
        url: `/certificates/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Certificate"],

    }),
  }),
});

export const {
  useGetAllCertificatesQuery,  
  useGetCertificateByIdQuery,
  useGetCertificatesByStudentIdQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificatesMutation
} = UserApi;
