import { api } from './api';

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/payments/create-order',
        method: 'POST',
        body: data,
      }),
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: '/payments/verify-payment',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useVerifyPaymentMutation } = paymentsApi;
