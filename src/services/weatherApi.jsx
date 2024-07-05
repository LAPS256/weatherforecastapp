import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openweathermap.org/data/2.5' }),
  endpoints: (builder) => ({
    getWeatherData: builder.query({
      query: ({ q, api_key }) => `/weather?q=${q ? q : "surat"}&units=metric&appid=${api_key}`,
    }),
    getWeatherDatafivedays: builder.query({
      query: ({ lat, lon, api_key }) => `/onecall?lat=${lat ? lat : 21.1667}&lon=${lon ? lon : 72.8333}&appid=${api_key}&units=${"metrics"}`,
    }),
  }),
});

export const { useGetWeatherDataQuery, useGetWeatherDatafivedaysQuery } = weatherApi;