import { api } from './api';

export const appointmentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllAppointments: builder.query({
      query: (params) => ({ url: '/appointments', params }),
      providesTags: ['Appointments'],
    }),
    getMyAppointments: builder.query({
      query: (params) => ({ url: '/appointments/mine', params }),
      providesTags: ['Appointments'],
    }),
    bookAppointment: builder.mutation({
      query: (body) => ({
        url: '/appointments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Appointments', 'Queue'],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/appointments/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Appointments'],
    }),
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
});

export const {
  useGetAllAppointmentsQuery,
  useGetMyAppointmentsQuery,
  useBookAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useCancelAppointmentMutation,
} = appointmentsApi;
