import type {
    IColor,
    TResponse,
    TResponseRedux,
} from '@/types';

import { baseApi } from "@/redux/baseApi";

const ColorManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //Color Start
        getAllColors: builder.query<TResponse<IColor[]>, unknown>({
            query: (params) => ({
                url: "colors",
                method: "POST", 
                data: params,
            }),
            providesTags: ["Color"],
        }),

        addColor: builder.mutation({
            query: (requestData) => ({
                url: '/colors/create',
                method: 'POST',
                data: requestData,
            }),
             invalidatesTags: ["Color"],
        }),

        updateColor: builder.mutation<IColor, { id: string; requestData: Partial<IColor> }>({
            query: ({ id, requestData }) => ({
                url: `/colors/${id}`,
                method: 'PATCH',
                data: requestData,  // ✅ correct
            }),
            invalidatesTags: ["Color"],
        }),


        deleteColor: builder.mutation({
            query: (id) => ({
                url: `/colors/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Color"],
        }),

        getColorById: builder.query({
            query: (id) => ({ url: `/colors/${id}`, method: 'GET' }),
             providesTags: (_result, _error, id) => [{ type: "Color", id }],
            transformResponse: (response: TResponseRedux<IColor>) => ({
                data: response.data,
                meta: response.meta,
            }),
            
        }),

        //Color End
    }),
});

export const {
    //Color Start
    useGetAllColorsQuery,
    useAddColorMutation,
    useUpdateColorMutation,
    useDeleteColorMutation,
    useGetColorByIdQuery,
   
} = ColorManagementApi;
