import { api } from './api';

export const slotsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: get ALL slots for a doctor (including booked)
    getAdminDoctorSlots: builder.query({
      query: ({ doctorId, date }) => ({
        url: `/slots/admin/${typeof doctorId === 'object' && doctorId !== null ? doctorId._id : doctorId}`,
        params: date ? { date } : {},
      }),
      providesTags: ['Slots'],
    }),
    // Public: get AVAILABLE slots for a doctor
    getDoctorSlots: builder.query({
      query: ({ doctorId, date }) => ({
        url: `/slots/${typeof doctorId === 'object' && doctorId !== null ? doctorId._id : doctorId}`,
        params: date ? { date } : {},
      }),
      providesTags: ['Slots'],
    }),
    // Create a single slot
    createSlot: builder.mutation({
      query: (body) => ({
        url: '/slots',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Slots'],
    }),
    // Bulk create slots
    createBulkSlots: builder.mutation({
      query: (body) => ({
        url: '/slots/bulk',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Slots'],
    }),
    // Delete a slot
    deleteSlot: builder.mutation({
      query: (id) => ({
        url: `/slots/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Slots'],
    }),
  }),
});

export const {
  useGetAdminDoctorSlotsQuery,
  useGetDoctorSlotsQuery,
  useCreateSlotMutation,
  useCreateBulkSlotsMutation,
  useDeleteSlotMutation,
} = slotsApi;
