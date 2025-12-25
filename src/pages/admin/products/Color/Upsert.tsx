import { useParams, useNavigate } from 'react-router';
import { useAppSelector } from '@/redux/hooks';
import { Button, Paper, Grid, Box, CircularProgress, } from "@mui/material";
import Controls from "@/components/controls";
import PageHeader from "@/components/ui/PageHeader";
import Form from "@/components/ui/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { colorSchema, ColorFormValues } from "@/schemas/products/productsManagement.schema";
import { useAddColorMutation, useGetColorByIdQuery, useUpdateColorMutation } from "@/redux/features/admin/products/colorManagement.api";
import { selectCurrentRole } from '@/redux/features/auth/authSlice';

const Upsert = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const currentRole = useAppSelector(selectCurrentRole) ?? 'admin';
  const { data: queryResponse, isLoading, isError } = useGetColorByIdQuery(id ?? "", {
    skip: !id, refetchOnMountOrArgChange: true,
  });
  let color = id && queryResponse?.data ? queryResponse.data : undefined;
  const [addCategory] = useAddColorMutation();
  const [updateCategory] = useUpdateColorMutation();

  const defaultValues: ColorFormValues = {
    name: color?.name || '',
    hexCode: color?.hexCode || '',
    isActive: color?.isActive ?? true,
    isDeleted: color?.isDeleted ?? false,
  };

  const onSubmit = async (values: ColorFormValues) => {
    const toastId = toast.loading(color ? "Updating..." : "Creating...");
    try {
      if (color) {
        await updateCategory({ id: color._id, requestData: values }).unwrap();
        navigate(`/${currentRole.toLowerCase()}/Colors`);
      } else {
        await addCategory(values).unwrap();
      }

      toast.success(
        color ? "Color updated successfully" : "Color created successfully",
        { id: toastId, position: "top-right" }
      );

    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong", { id: toastId, position: "top-right" });
    }
  };


  // --- Loading / Error states ---
  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (isError) return <Box>Error loading data</Box>;
  return (
    <Paper sx={{ overflow: "hidden", p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" pr={4}>
        <PageHeader title={color ? "Edit Color" : "Create a New Color"} subTitle="" />
      </Box>

      <Form onSubmit={onSubmit} defaultValues={defaultValues} resolver={zodResolver(colorSchema)} resetOnDefaultChange>
        <Box mt={2}>
          <Grid container spacing={2} justifyContent="center">
            <Grid size={{ xs: 6 }}>
              <Grid size={{ xs: 12 }}>
                <Controls.Input name="name" label="Color Name" type="text" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controls.Input name="hexCode" label="Hex Code" type="text" />
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
                    "&:hover": { backgroundColor: "#e88c00" },
                  }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Form>
    </Paper>
  )
}

export default Upsert