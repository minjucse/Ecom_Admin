import { Button, Paper, Grid, Box, CircularProgress, } from "@mui/material";
import Controls from "@/components/controls";
import PageHeader from "@/components/ui/PageHeader";
import Form from "@/components/ui/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { toast } from "sonner";
import ImageUpload from "@/components/controls/ImageUpload";
import { shopSchema, shopFormValues } from "@/schemas/shops/shopManagement.schema";
import {
  useAddShopMutation,
  useUpdateShopMutation,
  useGetAllShopsQuery,
} from "@/redux/features/admin/shops/shopManagement.api";

const ShopEntry = () => {
  const { data: ShopResponse, isLoading, isError } = useGetAllShopsQuery([
    { name: "limit", value: 1 },
  ]);
  let shop = ShopResponse?.[0]
  const [addShop] = useAddShopMutation();
  const [updateShop] = useUpdateShopMutation();

  const defaultValues: shopFormValues = shop
    ? {
      name: shop.name,
      phone: shop.phone,
      streetAddress: shop.streetAddress ?? "",
      contactPersonName: shop.contactPersonName ?? "",
      contactPersonPhone: shop.contactPersonPhone ?? "",
      website: shop.website ?? "",
      email: shop.email ?? "",
      facebook: shop.facebook ?? "",
      accountNumber: shop.accountNumber ?? "",
      remarks: shop.remarks ?? "",
      registrationDate: shop.registrationDate ? dayjs(shop.registrationDate) : null,
      expiryDate: shop.expiryDate ? dayjs(shop.expiryDate) : null,
      logoUrl: shop.logoUrl ?? "",
    }
    : {
      name: "",
      phone: "",
      streetAddress: "",
      contactPersonName: "",
      contactPersonPhone: "",
      website: "",
      email: "",
      facebook: "",
      accountNumber: "",
      remarks: "",
      registrationDate: null,
      expiryDate: null,
      logoUrl: "",
    };

 // --- Helpers ---
  const buildFormData = (data: shopFormValues) => {
    const formData = new FormData();

    const append = (key: string, value?: string) => {
      if (value) formData.append(key, value);
    };

    append("name", data.name);
    append("phone", data.phone);
    append("streetAddress", data.streetAddress);
    append("contactPersonName", data.contactPersonName);
    append("contactPersonPhone", data.contactPersonPhone);
    append("website", data.website);
    append("email", data.email);
    append("facebook", data.facebook);
    append("accountNumber", data.accountNumber);
    append("remarks", data.remarks);
    if (data.registrationDate)
      append("registrationDate", data.registrationDate.toISOString());
    if (data.expiryDate)
      append("expiryDate", data.expiryDate.toISOString());

    if (data.logoUrl instanceof File) {
      formData.append("logo", data.logoUrl);
    } else if (typeof data.logoUrl === "string" && data.logoUrl.trim()) {
      formData.append("logoUrl", data.logoUrl);
    }

    return formData;
  };

  // --- Submit ---
  const onSubmit = async (values: shopFormValues) => {
    const toastId = toast.loading(shop ? "Updating..." : "Creating...");
    try {
      const formData = buildFormData(values);
      const res = shop
        ? await updateShop({ id: shop._id, requestData: formData }).unwrap()
        : await addShop(formData).unwrap();

      toast.success(
        shop ? "Shop updated successfully" : "Shop created successfully",
        { id: toastId, position: "top-right" }
      );
      return res;
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong", {
        id: toastId,
      });
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
        <PageHeader title={shop ? "Edit Shop" : "Create a New Shop"} subTitle="" />
      </Box>

      <Form onSubmit={onSubmit} defaultValues={defaultValues} resolver={zodResolver(shopSchema)} resetOnDefaultChange>
        <Box mt={2}>
          <Grid container spacing={2} justifyContent="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.Input name="name" label="Shop Name" type="text" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.Input name="phone" label="Phone" type="text" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.Input name="streetAddress" label="Street Address" type="text" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.Input name="contactPersonName" label="Contact Person Name" type="text" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.Input name="contactPersonPhone" label="Contact Person Phone" type="text" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.Input name="website" label="Website" type="text" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.Input name="email" label="Email" type="text" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.Input name="facebook" label="Facebook" type="text" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.Input name="accountNumber" label="Account Number" type="text" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.Input name="remarks" label="Remarks" type="text" multiline rows={3} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.DatePicker name="registrationDate" label="Registration Date" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controls.DatePicker name="expiryDate" label="Expiry Date" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <ImageUpload
                 nameFile="logoUrl"
                  nameUrl="imageUrl" 
                title="Logo Image Upload"
                helperText="Accepts image (PNG/JPG/GIF)"
              />
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
    </Paper>
  );
};

export default ShopEntry;
