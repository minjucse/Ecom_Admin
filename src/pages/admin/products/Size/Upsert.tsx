import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { Button, Paper, Grid, Box, CircularProgress, } from "@mui/material";
import Controls from "@/components/controls";
import PageHeader from "@/components/ui/PageHeader";
import Form from "@/components/ui/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { sizeSchema, SizeFormValues } from "@/schemas/products/productsManagement.schema";
import { useAddSizeMutation, useGetSizeByIdQuery, useUpdateSizeMutation } from "@/redux/features/admin/products/sizeManagement.api";
import { selectCurrentRole } from '@/redux/features/auth/authSlice';


const SizeEntry = () => {
   const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const currentRole = useAppSelector(selectCurrentRole) ?? 'admin';
    const { data: queryResponse, isLoading, isError } = useGetSizeByIdQuery(id ?? "", {
      skip: !id, refetchOnMountOrArgChange: true,
    });
    let Size = id && queryResponse?.data ? queryResponse.data : undefined;
    const [addCategory] = useAddSizeMutation();
    const [updateCategory] = useUpdateSizeMutation();
  
    const defaultValues: SizeFormValues = {
      name: Size?.name || '',
      isActive: Size?.isActive ?? true,
      isDeleted: Size?.isDeleted ?? false,
    };
  
    const onSubmit = async (values: SizeFormValues) => {
      const toastId = toast.loading(Size ? "Updating..." : "Creating...");
      try {
        if (Size) {
          await updateCategory({ id: Size._id, requestData: values }).unwrap();
          navigate(`/${currentRole.toLowerCase()}/sizes`);
        } else {
          await addCategory(values).unwrap();
        }
  
        toast.success(
          Size ? "Size updated successfully" : "Size created successfully",
          { id: toastId, position: "top-right" }
        );
  
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong", { id: toastId, position: "top-right"});
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
        <PageHeader title={Size ? "Edit Size" : "Create a New Size"} subTitle="" />
      </Box>

      <Form onSubmit={onSubmit} defaultValues={defaultValues} resolver={zodResolver(sizeSchema)} resetOnDefaultChange>
        <Box mt={2}>
          <Grid container spacing={2} justifyContent="center">
            <Grid size={{ xs: 6 }}>
              <Grid size={{ xs: 12 }}>
                <Controls.Input name="name" label="Size Name" type="text" />
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

export default SizeEntry