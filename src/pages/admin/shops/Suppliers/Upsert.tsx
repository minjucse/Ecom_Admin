import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentRole } from "@/redux/features/auth/authSlice";
import { Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Controls from "@/components/controls";
import PageHeader from "@/components/ui/PageHeader";
import Form from "@/components/ui/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { SupplierFormValues, supplierSchema } from "@/schemas/shops/supplierManagement.schema";
import {
  useAddSupplierMutation,
  useGetSupplierByIdQuery,
  useUpdateSupplierMutation,
} from "@/redux/features/admin/shops/supplierManagement.api";
import type { ISupplier } from "@/types";

const SupplierEntry = () => {
  const currentRole = useAppSelector(selectCurrentRole) ?? "admin";
  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();

  const [addSupplier] = useAddSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();

  const {
    data: supplierResponse,
    isLoading,
    isError,
  } = useGetSupplierByIdQuery(id ?? "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const supplier = id && supplierResponse?.data ? supplierResponse.data : undefined;

  // ✅ Default values aligned with SupplierFormValues
  const defaultValues: SupplierFormValues = {
    companyName: supplier?.companyName || "",
    name: supplier?.name || "",
    streetAddress: supplier?.streetAddress || "",
    phone: supplier?.phone || "",
    country: supplier?.country || "",
    contactPersonName: supplier?.contactPersonName || "",
    contactPersonDesignation: supplier?.contactPersonDesignation || "",
    email: supplier?.email || "",
    remarks: supplier?.remarks || "",
    isActive: supplier?.isActive ?? true,
    isDeleted: supplier?.isDeleted ?? false,
  };

  const onSubmit = async (data: SupplierFormValues) => {
    const toastId = toast.loading(supplier ? "Updating..." : "Creating...");

    try {
      const payload: Partial<ISupplier> = { ...data };

      const res = supplier
        ? await updateSupplier({
            id: supplier._id,
            requestData: payload,
          }).unwrap()
        : await addSupplier(payload).unwrap();

      toast.success(
        supplier ? "Supplier updated successfully" : "Supplier created successfully",
        { id: toastId, position: "top-right" }
      );

      navigate(`/${currentRole.toLowerCase()}/suppliers`);
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
        <PageHeader
          title={id ? "Edit Supplier" : "Create a New Supplier"}
          subTitle=""
        />
      </Box>

      <Box>
        <Form
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          resolver={zodResolver(supplierSchema)}
          resetOnDefaultChange
        >
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">

              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="companyName" label="Company Name" type="text" />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="name" label="Supplier Name" type="text" />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="streetAddress" label="Street Address" type="text" />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="phone" label="Phone" type="text" />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input name="country" label="Country" type="text" />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input
                  name="contactPersonName"
                  label="Contact Person Name"
                  type="text"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controls.Input
                  name="contactPersonDesignation"
                  label="Designation"
                  type="text"
                />
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
                    "&:hover": { backgroundColor: "#e88c00" },
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

export default SupplierEntry;
