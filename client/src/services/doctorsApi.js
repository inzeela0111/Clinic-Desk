import { api } from './api';

export const doctorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: (params) => ({ url: '/doctors', params }),
      providesTags: ['Doctors'],
    }),
    getDoctor: builder.query({
      query: (id) => `/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Doctors', id }],
    }),
    addDoctor: builder.mutation({
      query: (body) => ({
        url: '/doctors',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Doctors'],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/doctors/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Doctors', id }, 'Doctors'],
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Doctors'],
    }),
    getPublicStats: builder.query({
      query: () => '/doctors/public-stats',
      providesTags: ['Doctors'],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useGetPublicStatsQuery,
  useAddDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorsApi;
