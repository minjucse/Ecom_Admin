import type {
    IAttributeGroup,
    IAttributeValue,
    TResponse,
    TResponseRedux,
} from '@/types';

import { baseApi } from "@/redux/baseApi";

const AttributeManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // --------------------------
        // Attribute Group Endpoints
        // --------------------------
        getAllAttributeGroups: builder.query<TResponse<IAttributeGroup[]>, unknown>({
            query: (params) => ({
                url: "attributeGroup",
                method: "POST",
                data: params,
            }),
            providesTags: ["Attribute"],
        }),
        getDropdownAttributeGroups: builder.query<{ data: { id: string; name: string }[] }, void>({
            query: () => ({
                url: '/attributeGroup/dropdown',
                method: 'GET',
            }),
        }),
        addAttributeGroup: builder.mutation({
            query: (requestData) => ({
                url: 'attributeGroup/create',
                method: 'POST',
                data: requestData,
            }),
            invalidatesTags: ["Attribute"],
        }),

        updateAttributeGroup: builder.mutation<IAttributeGroup, { id: string; requestData: Partial<IAttributeGroup> }>({
            query: ({ id, requestData }) => ({
                url: `attributeGroup/${id}`,
                method: 'PATCH',
                data: requestData,
            }),
            invalidatesTags: ["Attribute"],
        }),

        deleteAttributeGroup: builder.mutation({
            query: (id) => ({
                url: `attributeGroup/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Attribute"],
        }),

        getAttributeGroupById: builder.query({
            query: (id) => ({ url: `attributeGroup/${id}`, method: 'GET' }),
            providesTags: (_result, _error, id) => [{ type: "Attribute", id }],
            transformResponse: (response: TResponseRedux<IAttributeGroup>) => ({
                data: response.data,
                meta: response.meta,
            }),
        }),

        // --------------------------
        // Attribute Value Endpoints
        // --------------------------
        getAllAttributeValues: builder.query<TResponse<IAttributeValue[]>, unknown>({
            query: (params) => ({
                url: "attributeValue",
                method: "POST",
                data: params,
            }),
            providesTags: ["AttributeValue"],
        }),
        getDropdownAttributeValues: builder.query<{ data: { id: string; name: string }[] }, string | undefined>({
            query: (attributeGroupId) => ({
                url: '/attributeValue/dropdown',
                method: 'GET',
                params: attributeGroupId ? { attributeGroupId } : undefined,
            }),
        }),
        
        addAttributeValue: builder.mutation({
            query: (requestData) => ({
                url: 'attributeValue/create',
                method: 'POST',
                data: requestData,
            }),
            invalidatesTags: ["AttributeValue"],
        }),

        updateAttributeValue: builder.mutation<IAttributeValue, { id: string; requestData: Partial<IAttributeValue> }>({
            query: ({ id, requestData }) => ({
                url: `attributeValue/${id}`,
                method: 'PATCH',
                data: requestData,
            }),
            invalidatesTags: ["AttributeValue"],
        }),

        deleteAttributeValue: builder.mutation({
            query: (id) => ({
                url: `attributeValue/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["AttributeValue"],
        }),

        getAttributeValueById: builder.query({
            query: (id) => ({ url: `attributeValue/${id}`, method: 'GET' }),
            providesTags: (_result, _error, id) => [{ type: "AttributeValue", id }],
            transformResponse: (response: TResponseRedux<IAttributeValue>) => ({
                data: response.data,
                meta: response.meta,
            }),
        }),
    }),
});

export const {


    // Attribute Group
    useGetAllAttributeGroupsQuery,
    useGetDropdownAttributeGroupsQuery,
    useAddAttributeGroupMutation,
    useUpdateAttributeGroupMutation,
    useDeleteAttributeGroupMutation,
    useGetAttributeGroupByIdQuery,

    // Attribute Value
    useGetAllAttributeValuesQuery,
    useLazyGetDropdownAttributeValuesQuery,
    useAddAttributeValueMutation,
    useUpdateAttributeValueMutation,
    useDeleteAttributeValueMutation,
    useGetAttributeValueByIdQuery,
} = AttributeManagementApi;
