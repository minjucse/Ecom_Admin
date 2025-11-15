import type {
    ISubCategory,
    TResponse,
    TResponseRedux,
} from '@/types';

import { baseApi } from "@/redux/baseApi";

const SubCategoriesManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //SubCategory Start
        getAllSubCategories: builder.query<TResponse<ISubCategory[]>, unknown>({
            query: (params) => ({
                url: "sub-categories",
                method: "POST", 
                data: params,
            }),
            providesTags: ["SubCategory"],
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
             providesTags: (result, error, id) => [{ type: "SubCategory", id }],
            transformResponse: (response: TResponseRedux<ISubCategory>) => ({
                data: response.data,
                meta: response.meta,
            }),
            
        }),

        //SubCategory End
    }),
});

export const {
    //SubCategory Start
    useGetAllSubCategoriesQuery,
    useAddSubCategoryMutation,
    useUpdateSubCategoryMutation,
    useDeleteSubCategoryMutation,
    useGetSubCategoryByIdQuery,
   
} = SubCategoriesManagementApi;
