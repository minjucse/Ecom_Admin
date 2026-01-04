import type {
    IMeasurementUnit,
    TResponse,
    TResponseRedux,
} from '@/types';

import { baseApi } from "@/redux/baseApi";

const MeasurementManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //Measurement Start
        getAllMeasurements: builder.query<TResponse<IMeasurementUnit[]>, unknown>({
            query: (params) => ({
                url: "measurementUnit",
                method: "POST",
                data: params,
            }),
            providesTags: ["Measurement"],
        }),
        getDropdownMeasurementUnit: builder.query<{ data: { id: string; name: string }[] }, void>({
            query: () => ({
                url: '/measurementUnit/dropdown',
                method: 'GET',
            }),
        }),
        addMeasurement: builder.mutation({
            query: (requestData) => ({
                url: '/measurementUnit/create',
                method: 'POST',
                data: requestData,
            }),
            invalidatesTags: ["Measurement"],
        }),

        updateMeasurement: builder.mutation<IMeasurementUnit, { id: string; requestData: Partial<IMeasurementUnit> }>({
            query: ({ id, requestData }) => ({
                url: `measurementUnit/${id}`,
                method: 'PATCH',
                data: requestData,  // ✅ correct
            }),
            invalidatesTags: ["Measurement"],
        }),


        deleteMeasurement: builder.mutation({
            query: (id) => ({
                url: `measurementUnit/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["Measurement"],
        }),

        getMeasurementById: builder.query({
            query: (id) => ({ url: `measurementUnit/${id}`, method: 'GET' }),
            providesTags: (_result, _error, id) => [{ type: "Measurement", id }],
            transformResponse: (response: TResponseRedux<IMeasurementUnit>) => ({
                data: response.data,
                meta: response.meta,
            }),

        }),

        //Measurement End
    }),
});

export const {
    //Measurement Start
    useGetAllMeasurementsQuery,
    useGetDropdownMeasurementUnitQuery,
    useAddMeasurementMutation,
    useUpdateMeasurementMutation,
    useDeleteMeasurementMutation,
    useGetMeasurementByIdQuery,

} = MeasurementManagementApi;
