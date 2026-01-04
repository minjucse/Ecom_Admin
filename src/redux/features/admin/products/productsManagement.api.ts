import type {
    IProductDetail,
    TResponse,
    TResponseRedux,
} from '@/types';

import { baseApi } from "@/redux/baseApi";

const ProductDetailManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //ProductDetail Start
        getAllProductDetail: builder.query<TResponse<IProductDetail[]>, unknown>({
            query: (params) => ({
                url: "productDetail",
                method: "POST",
                data: params,
            }),
            providesTags: ["ProductDetail"],
        }),

        getDropdownProducts: builder.query<{ data: { id: string; name: string }[] }, void>({
            query: () => ({
                url: '/productDetail/dropdown',
                method: 'GET',
            }),
        }),
        addProductDetail: builder.mutation({
            query: (requestData) => ({
                url: '/productDetail/create',
                method: 'POST',
                data: requestData,
            }),
            invalidatesTags: ["ProductDetail"],
        }),

        updateProductDetail: builder.mutation<IProductDetail, { id: string; requestData: Partial<IProductDetail> }>({
            query: ({ id, requestData }) => ({
                url: `/productDetail/${id}`,
                method: 'PATCH',
                data: requestData,  // ✅ correct
            }),
            invalidatesTags: ["ProductDetail"],
        }),


        deleteProductDetail: builder.mutation({
            query: (id) => ({
                url: `/productDetail/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["ProductDetail"],
        }),

        getProductDetailById: builder.query({
            query: (id) => ({ url: `/productDetail/${id}`, method: 'GET' }),
            providesTags: (_result, _error, id) => [{ type: "ProductDetail", id }],
            transformResponse: (response: TResponseRedux<IProductDetail>) => ({
                data: response.data,
                meta: response.meta,
            }),

        }),

        //ProductDetail End
    }),
});

export const {
    //ProductDetail Start
    useGetAllProductDetailQuery,
    useGetDropdownProductsQuery,
    useAddProductDetailMutation,
    useUpdateProductDetailMutation,
    useDeleteProductDetailMutation,
    useGetProductDetailByIdQuery,

} = ProductDetailManagementApi;
