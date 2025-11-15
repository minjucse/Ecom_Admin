import { useParams, useNavigate } from 'react-router-dom';
import { Button, Paper, Grid, Box, CircularProgress } from "@mui/material";
import Controls from "@/components/controls";
import PageHeader from "@/components/ui/PageHeader";
import Form from "@/components/ui/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ImageUpload from "@/components/controls/ImageUpload";
import { bannerSchema, BannerFormValues } from "@/schemas/shops/bannerManagement.schema";
import {
  useAddBannerMutation,
  useGetBannerByIdQuery,
  useUpdateBannerMutation
} from "@/redux/features/admin/shops/bannerManagement.api";

const Upsert = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data: queryResponse, isLoading, isError } = useGetBannerByIdQuery(id ?? "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const banner = id && queryResponse?.data ? queryResponse.data : undefined;

  const [addBanner] = useAddBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
// ✅ FIXED: Proper default values
  const defaultValues: BannerFormValues = {
    name: banner?.name || "",
    imgPath: undefined,                     
    imageUrl: banner?.imgPath || "",   
    isActive: banner?.isActive ?? true,
    isDeleted: banner?.isDeleted ?? false,
  };

  // ✅ Build FormData properly
  const buildFormData = (data: BannerFormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);

    // When user uploads a new file
    if (data.imgPath instanceof File) {
      formData.append("banner", data.imgPath);
      formData.append("imageUrl", ""); // Clear old URL
    }
    // When keeping existing URL
    else if (data.imageUrl && typeof data.imageUrl === "string") {
      formData.append("imageUrl", data.imageUrl);
    }
    // No file and no URL
    else {
      formData.append("banner", "");
      formData.append("imageUrl", "");
    }

    formData.append("isActive", String(data.isActive));
    formData.append("isDeleted", String(data.isDeleted));

    return formData;
  };

  // ✅ Submit handler
  const onSubmit = async (values: BannerFormValues) => {
    const toastId = toast.loading(banner ? "Updating..." : "Creating...");

    try {
      const formData = buildFormData(values);

      if (banner) {
        await updateBanner({ id: banner._id, requestData: formData }).unwrap();
        navigate("/admin/banners");
      } else {
        await addBanner(formData).unwrap();
      }

      toast.success(
        banner ? "Banner updated successfully" : "Banner created successfully",
        { id: toastId, position: "top-right" }
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong", {
        id: toastId,
      });
    }
  };


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
        <PageHeader
          title={banner ? "Edit Banner" : "Create Banner"}
          subTitle=""
        />
      </Box>

      <Form
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        resolver={zodResolver(bannerSchema)}
        resetOnDefaultChange
      >
        <Box mt={2}>
          <Grid container spacing={2} justifyContent="center">
            <Grid size={{ xs: 6 }}>

              <Grid size={{ xs: 12 }}>
                <Controls.Input name="name" label="Banner Name" type="text" />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <ImageUpload
                  nameFile="imgPath"
                  nameUrl="imageUrl"
                  title="Banner Image Upload"
                  helperText="Accepts PNG, JPG, GIF"
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
          </Grid>
        </Box>
      </Form>
    </Paper>
  );
};

export default Upsert;
