import type {
    ISize,
    TResponse,
    TResponseRedux,
} from '@/types';

import { baseApi } from "@/redux/baseApi";

const SizeManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //Size Start
        getAllSize: builder.query<TResponse<ISize[]>, unknown>({
            query: (params) => ({
                url: "sizes",
                method: "POST", 
                data: params,
            }),
            providesTags: ["Size"],
        }),

        addSize: builder.mutation({
            query: (requestData) => ({
                url: '/sizes/create',
                method: 'POST',
                data: requestData,
            }),
             invalidatesTags: ["Size"],
        }),

        updateSize: builder.mutation<ISize, { id: string; requestData: Partial<ISize> }>({
            query: ({ id, requestData }) => ({
                url: `/sizes/${id}`,
                method: 'PATCH',
                data: requestData,  // ✅ correct
            }),
            invalidatesTags: ["Size"],
        }),


        deleteSize: builder.mutation({
            query: (id) => ({
                url: `/sizes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Size"],
        }),

        getSizeById: builder.query({
            query: (id) => ({ url: `/sizes/${id}`, method: 'GET' }),
             providesTags: (_result, _error, id) => [{ type: "Size", id }],
            transformResponse: (response: TResponseRedux<ISize>) => ({
                data: response.data,
                meta: response.meta,
            }),
            
        }),

        //Size End
    }),
});

export const {
    //Size Start
    useGetAllSizeQuery,
    useAddSizeMutation,
    useUpdateSizeMutation,
    useDeleteSizeMutation,
    useGetSizeByIdQuery,
   
} = SizeManagementApi;
