import type {
    ISupplier,
    TResponse,
    TResponseRedux,
} from '@/types';

import { baseApi } from "@/redux/baseApi";

const suppliersManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //Supplier Start
        getAllSuppliers: builder.query<TResponse<ISupplier[]>, unknown>({
            query: (params) => ({
                url: "suppliers",
                method: "POST", 
                data: params,
            }),
            providesTags: ["Supplier"],
        }),

        addSupplier: builder.mutation({
            query: (requestData) => ({
                url: '/suppliers/create',
                method: 'POST',
                data: requestData,
            }),
             invalidatesTags: ["Supplier"],
        }),

        updateSupplier: builder.mutation<ISupplier, { id: string; requestData: Partial<ISupplier> }>({
            query: ({ id, requestData }) => ({
                url: `/suppliers/${id}`,
                method: 'PATCH',
                data: requestData,  // ✅ correct
            }),
            invalidatesTags: ["Supplier"],
        }),


        deleteSupplier: builder.mutation({
            query: (id) => ({
                url: `/suppliers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Supplier"],
        }),

        getSupplierById: builder.query({
            query: (id) => ({ url: `/suppliers/${id}`, method: 'GET' }),
             providesTags: (result, error, id) => [{ type: "Supplier", id }],
            transformResponse: (response: TResponseRedux<ISupplier>) => ({
                data: response.data,
                meta: response.meta,
            }),
            
        }),

        //Supplier End
    }),
});

export const {
    //Supplier Start
    useGetAllSuppliersQuery,
    useAddSupplierMutation,
    useUpdateSupplierMutation,
    useDeleteSupplierMutation,
    useGetSupplierByIdQuery,
    //Supplier End

} = suppliersManagementApi;
