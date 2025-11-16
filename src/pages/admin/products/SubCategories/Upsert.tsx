import { useParams, useNavigate } from 'react-router-dom';
import { Button, Paper, Grid, Box, CircularProgress } from "@mui/material";
import Controls from "@/components/controls";
import PageHeader from "@/components/ui/PageHeader";
import Form from "@/components/ui/useForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { subCategorySchema, SubCategoryFormValues } from "@/schemas/products/productsManagement.schema";
import {
    useAddSubCategoryMutation,
    useGetSubCategoryByIdQuery,
    useUpdateSubCategoryMutation
} from "@/redux/features/admin/products/subCategoryManagement.api";
import { useGetDropdownCategoriesQuery } from "@/redux/features/admin/products/categoryManagement.api";
import { useState } from 'react';

const UpsertSubCategory = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [formKey, setFormKey] = useState(0);

    const { data: queryResponse, isLoading, isError } = useGetSubCategoryByIdQuery(id ?? "", {
        skip: !id,
        refetchOnMountOrArgChange: true,
    });

    const { data: dropdownResp } = useGetDropdownCategoriesQuery();

    const categories = (dropdownResp?.data ?? []).map((item: any) => ({
        id: item._id,
        name: item.name,
    }));

    const Category = id && queryResponse?.data ? queryResponse.data : undefined;

    const [addCategory] = useAddSubCategoryMutation();
    const [updateCategory] = useUpdateSubCategoryMutation();

    const defaultValues: SubCategoryFormValues = {
        name: Category?.name || "",
        description: Category?.description || "",
        categoryId: Category?.categoryId || "",
        isActive: Category?.isActive ?? true,
        isDeleted: Category?.isDeleted ?? false,
    };

    const onSubmit = async (
        values: SubCategoryFormValues
    ) => {
        const toastId = toast.loading(Category ? "Updating..." : "Creating...");

        try {
            if (Category) {
                await updateCategory({
                    id: Category._id,
                    requestData: values
                }).unwrap();

                toast.success("Sub Category updated successfully", {
                    id: toastId,
                    position: "top-right",
                });

                navigate("/admin/sub-categories");
            } else {
                await addCategory(values).unwrap();

                toast.success("Sub Category created successfully", {
                    id: toastId,
                    position: "top-right",
                });

                setFormKey(prev => prev + 1);
            }

        } catch (error: any) {
            toast.error(error?.data?.message || "Something went wrong", {
                id: toastId,
            });
        }
    };

    // Loading UI
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
                    title={Category ? "Edit Sub Category" : "Create a New Sub Category"}
                    subTitle=""
                />
            </Box>

            <Form
                key={formKey}
                onSubmit={onSubmit}
                defaultValues={defaultValues}
                resolver={zodResolver(subCategorySchema)}
                resetOnDefaultChange
            >
                <Box mt={2}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid size={{ xs: 6 }}>
                            <Grid size={{ xs: 12 }}>
                                <Controls.Select
                                    name="categoryId"
                                    label="Parent Category"
                                    options={categories}   // ✅ correct structure
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controls.Input
                                    name="name"
                                    label="Sub Category"
                                    type="text"
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Controls.Input
                                    name="description"
                                    label="Description"
                                    type="text"
                                    multiline
                                    rows={3}
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

export default UpsertSubCategory;
