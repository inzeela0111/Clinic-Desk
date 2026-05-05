import { api } from './api';

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/admin/stats',
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
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetTodayScheduleQuery,
  useGetRevenueStatsQuery,
} = dashboardApi;
