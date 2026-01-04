import type {
    ICategory,
    ISubCategory,
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
            providesTags: (_result, _error, id) => [{ type: "Category", id }],
            transformResponse: (response: TResponseRedux<ICategory>) => ({
                data: response.data,
                meta: response.meta,
            }),

        }),

        //Category End
        //SubCategory Start
        getAllSubCategories: builder.query<TResponse<ISubCategory[]>, unknown>({
            query: (params) => ({
                url: "sub-categories",
                method: "POST",
                data: params,
            }),
            providesTags: ["SubCategory"],
        }),

        getDropdownSubCategories: builder.query<{ data: { id: string; name: string }[] }, string | undefined>({
            query: (categoryId) => ({
                url: '/sub-categories/dropdown',
                method: 'GET',
                params: categoryId ? { categoryId } : undefined,
            }),
        }),

        addSubCategory: builder.mutation({
            query: (requestData) => ({
                url: '/sub-categories/create',
                method: 'POST',
                data: requestData,
            }),
            invalidatesTags: ["SubCategory"],
        }),

        updateSubCategory: builder.mutation<ISubCategory, { id: string; requestData: Partial<ISubCategory> }>({
            query: ({ id, requestData }) => ({
                url: `/sub-categories/${id}`,
                method: 'PATCH',
                data: requestData,  // ✅ correct
            }),
            invalidatesTags: ["SubCategory"],
        }),


        deleteSubCategory: builder.mutation({
            query: (id) => ({
                url: `/sub-categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["SubCategory"],
        }),

        getSubCategoryById: builder.query({
            query: (id) => ({ url: `/sub-categories/${id}`, method: 'GET' }),
            providesTags: (_result, _error, id) => [{ type: "SubCategory", id }],
            transformResponse: (response: TResponseRedux<ISubCategory>) => ({
                data: response.data,
                meta: response.meta,
            }),

        }),

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
    //SubCategory Start
    useGetAllSubCategoriesQuery,
    useLazyGetDropdownSubCategoriesQuery,
    useAddSubCategoryMutation,
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation,
    useGetSubCategoryByIdQuery,
} = CategoriesManagementApi;
