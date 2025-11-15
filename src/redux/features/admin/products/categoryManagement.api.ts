import type {
    ICategory,
    TResponse,
    TResponseRedux,
} from '@/types';

import { baseApi } from "@/redux/baseApi";

const CategoriesManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //Category Start
        getAllCategories: builder.query<TResponse<ICategory[]>, unknown>({
            query: (params) => ({
                url: "categories",
                method: "POST",
                data: params,
            }),
            providesTags: ["Category"],
        }),

        getDropdownCategories: builder.query<{ data: { id: string; name: string }[] }, void>({
            query: () => ({
                url: '/categories/dropdown',  
                method: 'GET',           
            }),
        }),
        
        addCategory: builder.mutation({
            query: (requestData) => ({
                url: '/categories/create',
                method: 'POST',
                data: requestData,
            }),
            invalidatesTags: ["Category"],
        }),

        updateCategory: builder.mutation<ICategory, { id: string; requestData: Partial<ICategory> }>({
            query: ({ id, requestData }) => ({
                url: `/categories/${id}`,
                method: 'PATCH',
                data: requestData,  // ✅ correct
            }),
            invalidatesTags: ["Category"],
        }),


        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Category"],
        }),

        getCategoryById: builder.query({
            query: (id) => ({ url: `/categories/${id}`, method: 'GET' }),
            providesTags: (result, error, id) => [{ type: "Category", id }],
            transformResponse: (response: TResponseRedux<ICategory>) => ({
                data: response.data,
                meta: response.meta,
            }),

        }),

        //Category End
    }),
});

export const {
    //Category Start
    useGetAllCategoriesQuery,
    useGetDropdownCategoriesQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetCategoryByIdQuery,
    //Category End

} = CategoriesManagementApi;
