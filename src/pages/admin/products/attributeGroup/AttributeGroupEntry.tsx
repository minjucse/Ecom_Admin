import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentRole } from "@/redux/features/auth/authSlice";
import { Button, Paper, Box} from "@mui/material";
import Grid from '@mui/material/Grid';
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import Controls from "@/components/controls";
import PageHeader from "@/components/ui/PageHeader";
import Form from "@/components/ui/useForm";

import {
  attributeSchema,
  AttributeFormValues,
} from "@/schemas/products/productsManagement.schema";

import {
  useAddAttributeGroupMutation,
  useGetAttributeGroupByIdQuery,
  useUpdateAttributeGroupMutation,
} from "@/redux/features/admin/products/attribute.api";
import { IAttributeGroup } from "@/types";


const AttributeGroupEntry = () => {
  const currentRole = useAppSelector(selectCurrentRole) ?? 'admin';
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data: groupData, isLoading, isError } = useGetAttributeGroupByIdQuery(id ?? "", {
    skip: !id,
    refetchOnMountOrArgChange: true
  });

  const [addGroup] = useAddAttributeGroupMutation();
  const [updateGroup] = useUpdateAttributeGroupMutation();

  const group = id && groupData?.data ? groupData.data : undefined;

  const defaultValues: AttributeFormValues = {
    name: group?.name || "",
    isActive: group?.isActive ?? true,
    isDeleted: group?.isDeleted ?? false,
  };

  const onSubmit = async (data: AttributeFormValues) => {
    const toastId = toast.loading(group ? "Updating..." : "Creating...");
    try {
      const payload: Partial<IAttributeGroup> = { ...data };

      if (id) {
        await updateGroup({ id, requestData: payload }).unwrap();
      } else {
        await addGroup(payload).unwrap();
      }
      toast.success(group ? "Attribute Group updated successfully" : "Attribute Group created successfully", { id: toastId });
      navigate(`/${currentRole.toLowerCase()}/attribute-groups`);
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
          title={id ? "Edit Attribute Group" : "Create Attribute Group"}
          subTitle="Manage attribute groups like Color, Size"
        />
      </Box>

      <Box>
        <Form
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          resolver={zodResolver(attributeSchema)}
          resetOnDefaultChange={true}
        >
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid size={{ xs: 6 }}>
                <Grid size={{ xs: 12 }}>
                  <Controls.Input name="name" label="Group Name" type="text" />
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
      </Box>
    </Paper>
  );
};

export default AttributeGroupEntry;
