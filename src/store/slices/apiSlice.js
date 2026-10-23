import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Mess", "User"],
  endpoints: (builder) => ({
    getMesses: builder.query({ query: (params = {}) => ({ url: "/messes", params }), providesTags: ["Mess"] }),
    getMe: builder.query({ query: () => "/auth/me", providesTags: ["User"] }),
  }),
});
export const { useGetMessesQuery, useGetMeQuery } = apiSlice;
