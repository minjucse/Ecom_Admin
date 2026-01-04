import { useState } from "react";
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
  attributeValueSchema,
  AttributeValueFormValues,
} from "@/schemas/products/productsManagement.schema";

import {
  useAddAttributeValueMutation,
  useGetAttributeValueByIdQuery,
  useUpdateAttributeValueMutation,
  useGetDropdownAttributeGroupsQuery,
} from "@/redux/features/admin/products/attribute.api";
import { IAttributeValue } from "@/types";

const AttributeValueEntry = () => {
  const currentRole = useAppSelector(selectCurrentRole) ?? 'admin';
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [formKey, setFormKey] = useState(0);

  const { data: valueData, isLoading, isError } = useGetAttributeValueByIdQuery(id ?? "", {
    skip: !id,
    refetchOnMountOrArgChange: true
  });
  const { data: attributeGroups } = useGetDropdownAttributeGroupsQuery();

  const [addValue] = useAddAttributeValueMutation();
  const [updateValue] = useUpdateAttributeValueMutation();

  const groups = (attributeGroups?.data ?? []).map((item: any) => ({
    id: item._id || item.id,
    name: item.name,
  }));

  const AttributeValue = id && valueData?.data ? valueData.data : undefined;

  const defaultValues: AttributeValueFormValues = {
    name: AttributeValue?.name || "",
    value: AttributeValue?.value || "",
    attributeGroupId: AttributeValue?.attributeGroupId || "",
    isActive: AttributeValue?.isActive ?? true,
    isDeleted: AttributeValue?.isDeleted ?? false,
  };

  const onSubmit = async (data: AttributeValueFormValues) => {
    const toastId = toast.loading(AttributeValue ? "Updating..." : "Creating...");
    try {
      const payload: Partial<IAttributeValue> = {
        ...data,
        value: data.value || undefined
      };

      if (id) {
        await updateValue({ id, requestData: payload }).unwrap();
        toast.success("Attribute Value updated successfully", { id: toastId });
        navigate(`/${currentRole.toLowerCase()}/attribute-values`);
      } else {
        await addValue(data).unwrap();
        toast.success("Attribute Value created successfully", { id: toastId });
        setFormKey(prev => prev + 1);
      }
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
          title={AttributeValue ? "Edit Attribute Value" : "Create Attribute Value"}
          subTitle=""
        />
      </Box>

      <Box>
        <Form
          key={formKey}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          resolver={zodResolver(attributeValueSchema)}
          resetOnDefaultChange={true}
        >
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid size={{ xs: 6 }}>
                <Grid size={{ xs: 12 }}>
                  <Controls.Select
                    name="attributeGroupId"
                    label="Attribute Group"
                    options={groups}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controls.Input name="name" label="Display Name" type="text" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controls.Input name="value" label="Value (Optional)" type="text" />
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

export default AttributeValueEntry;
