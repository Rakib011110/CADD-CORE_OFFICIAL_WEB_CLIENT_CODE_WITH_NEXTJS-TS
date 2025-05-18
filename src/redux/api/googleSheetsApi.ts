// src/redux/api/formDataApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const SHEET_ID = 'আপনার_SHEET_ID';
const API_KEY = 'আপনার_API_KEY';
const SHEET_NAME = 'Form Responses 1';

export const formDataApi = createApi({
  reducerPath: 'formDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/`,
  }),
  endpoints: (builder) => ({
    getFormResponses: builder.query<string[][], void>({
      query: () => `${encodeURIComponent(SHEET_NAME)}?key=${API_KEY}`,
      transformResponse: (response: { values: string[][] }) => response.values,
    }),
  }),
});

export const { useGetFormResponsesQuery } = formDataApi;
