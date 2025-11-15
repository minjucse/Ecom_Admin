import type { TResponse, IBanner, TResponseRedux } from '@/types';
import { baseApi } from "@/redux/baseApi";

export const BannersManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBanners: builder.query<TResponse<IBanner[]>, unknown>({
            query: (params) => ({
                url: "/banners",
                method: "POST",
                data: params,
            }),
            providesTags: ["Banner"],
        }),


        getBannerById: builder.query({
            query: (id) => ({ url: `/banners/${id}`, method: 'GET' }),
            providesTags: (result, error, id) => [{ type: "Brand", id }],
            transformResponse: (response: TResponseRedux<IBanner>) => ({
                data: response.data,
                meta: response.meta,
            }),

        }),

        addBanner: builder.mutation({
            query: (formData: FormData) => ({
                url: "/banners/create",
                method: "POST",
                data: formData,        
            }),
            invalidatesTags: ["Banner"],
        }),
        updateBanner: builder.mutation<IBanner, { id: string; requestData: FormData }>({
            query: ({ id, requestData }) => ({
                url: `/banners/${id}`,
                method: "PATCH",
                data: requestData,     // ✅ FormData here too
            }),
            invalidatesTags: ["Banner"],
        }),
        deleteBanner: builder.mutation<IBanner, string>({
            query: (id) => ({
                url: `/banners/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Banner", id: "LIST" }],
        }),
        // ---------------- Banner End ----------------
    }),
});

export const {
    useGetAllBannersQuery,
    useGetBannerByIdQuery,
    useAddBannerMutation,
    useUpdateBannerMutation,
    useDeleteBannerMutation,
} = BannersManagementApi;
