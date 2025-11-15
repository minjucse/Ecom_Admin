import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentRole } from '@/redux/features/auth/authSlice';
import { Button, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import Controls from "@/components/controls";
import PageHeader from "@/components/ui/PageHeader";
import Form from "@/components/ui/useForm";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { BrandFormValues, brandSchema } from '../../../../schemas/shops/brandsManagement.schema';
import { useAddBrandMutation, useGetBrandByIdQuery, useUpdateBrandMutation } from '../../../../redux/features/admin/shops/brandsManagement.api';
import { IBrand } from '@/types';

const BrandEntry = () => {
  const currentRole = useAppSelector(selectCurrentRole) ?? 'admin';
  const { id } = useParams<{ id?: string }>();
  const [addBrand] = useAddBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const navigate = useNavigate();

  const { data: brandResponse, isLoading, isError } = useGetBrandByIdQuery(id ?? "", {
    skip: !id, refetchOnMountOrArgChange: true,
  });
  const brand = id && brandResponse?.data ? brandResponse.data : undefined;

  const defaultValues: BrandFormValues = {
    name: brand?.name || '',
    brandCode: brand?.brandCode || '',
    address: brand?.address || '',
    phone: brand?.phone || '',
    contactPersonName: brand?.contactPersonName || '',
    country: brand?.country || '',
    madeInCountry: brand?.madeInCountry || '',
    email: brand?.email || '',
    remarks: brand?.remarks || '',
    isActive: brand?.isActive ?? true,
    isDeleted: brand?.isDeleted ?? false,
  };

  const onSubmit = async (data: BrandFormValues) => {
    const toastId = toast.loading(brand ? "Updating..." : "Creating...");

    try {
      const payload: Partial<IBrand> = { ...data };

      const res = brand
        ? await updateBrand({ id: brand._id, requestData: payload }).unwrap()
        : await addBrand(payload).unwrap();

      toast.success(brand ? "Brand updated successfully" : "Brand created successfully", {
        id: toastId,
        position: "top-right",
      });

      navigate(`/${currentRole.toLowerCase()}/brands`)
      return res;
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong", { id: toastId });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <Paper sx={{ overflow: "hidden", p: 2 }}>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 4 }}>
        <PageHeader title={id ? 'Edit Brand' : 'Create a New Brand'} subTitle="" />
      </Box>

      <Box>
        <Form
          onSubmit={onSubmit}
          defaultValues={defaultValues} // ✅ just pass object, not function
          resolver={zodResolver(brandSchema)}
          resetOnDefaultChange={true}
        >
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="name" label="Brand Name" type="text" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="brandCode" label="Brand Code" type="text" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="address" label="Address" type="text" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="phone" label="Phone" type="text" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="contactPersonName" label="Contact Person Name" type="text" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="country" label="Country" type="text" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="madeInCountry" label="Made In Country" type="text" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="email" label="Email" type="text" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="remarks" label="Remarks" type="text" />
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
          </Box>
        </Form>
      </Box>
    </Paper>
  );
};

export default BrandEntry;
