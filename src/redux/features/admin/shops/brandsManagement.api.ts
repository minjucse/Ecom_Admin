import type {
    IBrand,
    TResponse,
    TResponseRedux,
} from '@/types';

import { baseApi } from "@/redux/baseApi";

const brandsManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //Brand Start
        getAllBrands: builder.query<TResponse<IBrand[]>, unknown>({
            query: (params) => ({
                url: "brands",
                method: "POST", 
                data: params,
            }),
            providesTags: ["Brand"],
        }),

        addBrand: builder.mutation({
            query: (requestData) => ({
                url: '/brands/create',
                method: 'POST',
                data: requestData,
            }),
             invalidatesTags: ["Brand"],
        }),

        updateBrand: builder.mutation<IBrand, { id: string; requestData: Partial<IBrand> }>({
            query: ({ id, requestData }) => ({
                url: `/brands/${id}`,
                method: 'PATCH',
                data: requestData,  // ✅ correct
            }),
            invalidatesTags: ["Brand"],
        }),


        deleteBrand: builder.mutation({
            query: (id) => ({
                url: `/brands/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Brand"],
        }),

        getBrandById: builder.query({
            query: (id) => ({ url: `/brands/${id}`, method: 'GET' }),
             providesTags: (result, error, id) => [{ type: "Brand", id }],
            transformResponse: (response: TResponseRedux<IBrand>) => ({
                data: response.data,
                meta: response.meta,
            }),
            
        }),

        //Brand End
    }),
});

export const {
    //Brand Start
    useGetAllBrandsQuery,
    useAddBrandMutation,
    useUpdateBrandMutation,
    useDeleteBrandMutation,
    useGetBrandByIdQuery,
    //Brand End

} = brandsManagementApi;
