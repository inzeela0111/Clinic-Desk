import { api } from './api';

export const billingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query({
      query: (params) => ({ url: '/billing', params }),
      providesTags: ['Billing'],
    }),
    getInvoice: builder.query({
      query: (id) => `/billing/${id}`,
      providesTags: (result, error, id) => [{ type: 'Billing', id }],
    }),
    addInvoice: builder.mutation({
      query: (body) => ({
        url: '/billing',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Billing'],
    }),
    updateInvoiceStatus: builder.mutation({
      query: ({ id, paymentStatus, paymentMethod }) => ({
        url: `/billing/${id}/pay`,
        method: 'PATCH',
        body: { paymentStatus, paymentMethod },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Billing', id }, 'Billing'],
    }),
    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/billing/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Billing'],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useAddInvoiceMutation,
  useUpdateInvoiceStatusMutation,
  useDeleteInvoiceMutation,
} = billingApi;
