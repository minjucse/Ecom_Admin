import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentRole } from "@/redux/features/auth/authSlice";
import { Button, Paper, Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import Controls from "@/components/controls";
import PageHeader from "@/components/ui/PageHeader";
import Form from "@/components/ui/useForm";

import {
  measurementSchema,
  MeasurementFormValues,
} from "@/schemas/products/productsManagement.schema";

import {
  useAddMeasurementMutation,
  useGetMeasurementByIdQuery,
  useUpdateMeasurementMutation,
} from "@/redux/features/admin/products/measurementUnit.api";
import { IMeasurementUnit } from "@/types";

const MeasurementEntry = () => {
  const currentRole = useAppSelector(selectCurrentRole) ?? 'admin';
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data: measurementData, isLoading, isError } = useGetMeasurementByIdQuery(id ?? "", {
    skip: !id,
    refetchOnMountOrArgChange: true
  });
  const [addMeasurement] = useAddMeasurementMutation();
  const [updateMeasurement] = useUpdateMeasurementMutation();

  const measurement = id && measurementData?.data ? measurementData.data : undefined;

  const defaultValues: MeasurementFormValues = {
    name: measurement?.name || "",
    measurementUnitSymbol: measurement?.measurementUnitSymbol || "",
    isActive: measurement?.isActive ?? true,
    isDeleted: measurement?.isDeleted ?? false,
  };

  const onSubmit = async (data: MeasurementFormValues) => {
    const toastId = toast.loading(measurement ? "Updating..." : "Creating...");
    try {
      const payload: Partial<IMeasurementUnit> = { ...data };

      if (id) {
        await updateMeasurement({ id, requestData: payload }).unwrap();
      } else {
        await addMeasurement(data).unwrap();
      }
      toast.success(measurement ? "Measurement Unit updated successfully" : "Measurement Unit created successfully", { id: toastId });
      navigate(`/${currentRole.toLowerCase()}/measurements`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed", { id: toastId });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <Paper sx={{ overflow: "hidden", p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 4 }}>
        <PageHeader
          title={id ? "Edit Measurement Unit" : "Create Measurement Unit"}
          subTitle="Manage measurement units"
        />
      </Box>

      <Box>
        <Form
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          resolver={zodResolver(measurementSchema)}
          resetOnDefaultChange={true}
        >
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid size={{ xs: 6 }}>
                <Grid size={{ xs: 12 }}>
                  <Controls.Input name="name" label="Unit Name" type="text" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controls.Input name="measurementUnitSymbol" label="Symbol" type="text" />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }} sx={{ ml: "5em", mr: "5em" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      mt: 2,
                      borderRadius: 28,
                      color: "#ffffff",
                      backgroundColor: "#FF9A01",
                      '&:hover': { backgroundColor: '#e88c00' },
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Form>
      </Box>
    </Paper>
  );
};

export default MeasurementEntry;
