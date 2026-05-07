import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../features/auth/authSlice';

const baseUrl = import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_BASE_URL.includes('localhost')
  ? import.meta.env.VITE_API_BASE_URL 
  : '/api';

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // Prefer Redux state, fallback to localStorage in case of race condition
    const token = getState().auth.token || localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Only auto-logout if the /auth/profile identity check returns 401
  // NOT on every 401 (dashboard, etc.) — that caused a login bounce loop
  if (result.error && result.error.status === 401) {
    const url = typeof args === 'string' ? args : args?.url || '';
    if (url.includes('/auth/profile')) {
      api.dispatch(logout());
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Patients', 'Appointments', 'Queue', 'Doctors', 'Prescriptions', 'Billing', 'Dashboard', 'Slots'],
  endpoints: () => ({}),
});
