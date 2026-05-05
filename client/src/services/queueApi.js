import { api } from './api';

export const queueApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQueue: builder.query({
      query: (params) => ({ url: '/queue', params }),
      providesTags: ['Queue'],
    }),
    addToQueue: builder.mutation({
      query: (body) => ({
        url: '/queue/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Queue'],
    }),
    updateQueueStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/queue/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Queue'],
    }),
    removeFromQueue: builder.mutation({
      query: (id) => ({
        url: `/queue/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Queue'],
    }),
  }),
});

export const {
  useGetQueueQuery,
  useAddToQueueMutation,
  useUpdateQueueStatusMutation,
  useRemoveFromQueueMutation,
} = queueApi;
