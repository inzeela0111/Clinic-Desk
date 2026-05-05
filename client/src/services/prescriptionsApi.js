import { api } from './api';

export const prescriptionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPrescriptions: builder.query({
      query: (params) => ({ url: '/prescriptions', params }),
      providesTags: ['Prescriptions'],
    }),
    getPrescription: builder.query({
      query: (id) => `/prescriptions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Prescriptions', id }],
    }),
    addPrescription: builder.mutation({
      query: (body) => ({
        url: '/prescriptions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Prescriptions'],
    }),
    deletePrescription: builder.mutation({
      query: (id) => ({
        url: `/prescriptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Prescriptions'],
    }),
  }),
});

export const {
  useGetPrescriptionsQuery,
  useGetPrescriptionQuery,
  useAddPrescriptionMutation,
  useDeletePrescriptionMutation,
} = prescriptionsApi;
