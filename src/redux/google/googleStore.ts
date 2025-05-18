// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { formDataApi } from '../api/googleSheetsApi';

export const store = configureStore({
  reducer: {
    [formDataApi.reducerPath]: formDataApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(formDataApi.middleware),
});
