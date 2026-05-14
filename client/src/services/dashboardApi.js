import { api } from './api';

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: (range = 'week') => `/admin/stats?range=${range}`,
      providesTags: ['Dashboard'],
    }),
    getTodaySchedule: builder.query({
      query: () => '/admin/today',
      providesTags: ['Dashboard', 'Appointments'],
    }),
    getRevenueStats: builder.query({
      query: () => '/admin/revenue',
      providesTags: ['Dashboard', 'Billing'],
    }),
    getPatients: builder.query({
      query: () => '/admin/patients',
      providesTags: ['Patients'],
    }),
    getPatientDetails: builder.query({
      query: (id) => `/admin/patients/${id}`,
      providesTags: (result, error, id) => [{ type: 'Patients', id }],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetTodayScheduleQuery,
  useGetRevenueStatsQuery,
  useGetPatientsQuery,
  useGetPatientDetailsQuery,
} = dashboardApi;
