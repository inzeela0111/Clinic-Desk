import { api } from './api';

export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSuggestedSpeciality: builder.mutation({
      query: (symptoms) => ({
        url: '/ai/symptoms',
        method: 'POST',
        body: { symptoms },
      }),
    }),
  }),
});

export const { useGetSuggestedSpecialityMutation } = aiApi;
