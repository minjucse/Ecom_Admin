import type { IResponse, IShop } from '@/types';
import { baseApi } from "@/redux/baseApi";

export const shopsManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ---------------- Shop ----------------
        getAllShops: builder.query<IShop[], unknown>({
            query: (params) => ({
                url: "/shops",
                method: "POST",
                data: params, // use `body: params` if using fetchBaseQuery
            }),
            transformResponse: (response: IResponse<IShop[]>) => response.data,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "Shop" as const, id })),
                        { type: "Shop", id: "LIST" },
                    ]
                    : [{ type: "Shop", id: "LIST" }],
        }),

        getShopById: builder.query<IShop, string>({
            query: (id) => ({
                url: `/shops/${id}`,
                method: "GET",
            }),
            transformResponse: (response: IResponse<IShop>) => response.data,
            providesTags: (result, error, id) => [{ type: "Shop", id }],
        }),

        addShop: builder.mutation({
            query: (formData: FormData) => ({
                url: "/shops/create",
                method: "POST",
                data: formData,        // ✅ FormData goes here
            }),
            invalidatesTags: ["Shop"],
        }),
        updateShop: builder.mutation<IShop, { id: string; requestData: FormData }>({
            query: ({ id, requestData }) => ({
                url: `/shops/${id}`,
                method: "PATCH",
                data: requestData,     // ✅ FormData here too
            }),
            invalidatesTags: ["Shop"],
        }),
        deleteShop: builder.mutation<IShop, string>({
            query: (id) => ({
                url: `/shops/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: "Shop", id: "LIST" }],
        }),
        // ---------------- Shop End ----------------
    }),
});

export const {
    useGetAllShopsQuery,
    useGetShopByIdQuery,
    useAddShopMutation,
    useUpdateShopMutation,
    useDeleteShopMutation,
} = shopsManagementApi;
