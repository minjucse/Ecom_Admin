
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentRole } from "@/redux/features/auth/authSlice";

import PageHeader from "@/components/ui/PageHeader";
import Form from "@/components/ui/useForm";
import { ProductFormContent } from "@/components/modules/products";

import {
  ProductDetailSchema,
  ProductDetailFormValues,
} from "@/schemas/products/productsManagement.schema";

import {
  useAddProductDetailMutation,
  useGetProductDetailByIdQuery,
  useUpdateProductDetailMutation,
} from "@/redux/features/admin/products/productsManagement.api";

import { useGetDropdownCategoriesQuery, useLazyGetDropdownSubCategoriesQuery } from "@/redux/features/admin/products/categoryManagement.api";
import { useGetDropdownMeasurementUnitQuery } from "@/redux/features/admin/products/measurementUnit.api";
import {
  useGetDropdownAttributeGroupsQuery,
  useLazyGetDropdownAttributeValuesQuery,
} from "@/redux/features/admin/products/attribute.api";
import { useGetDropdownBrandsQuery } from "@/redux/features/admin/shops/brandsManagement.api";
import { IProductDetail } from "@/types";

const ProductDetailEntry = () => {
  const currentRole = useAppSelector(selectCurrentRole) ?? "admin";
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // API Hooks
  const { data: productResponse, isLoading, isError } = useGetProductDetailByIdQuery(id ?? "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const product = id && productResponse?.data ? productResponse.data : undefined;

  const { data: brands } = useGetDropdownBrandsQuery();
  const { data: categories } = useGetDropdownCategoriesQuery();
  const { data: units } = useGetDropdownMeasurementUnitQuery();
  const { data: attributes } = useGetDropdownAttributeGroupsQuery();

  const [fetchSubCategories, { data: subCategories }] = useLazyGetDropdownSubCategoriesQuery();
  const [fetchAttributeValues] = useLazyGetDropdownAttributeValuesQuery();

  const [addProduct] = useAddProductDetailMutation();
  const [updateProduct] = useUpdateProductDetailMutation();

  // Default Values
  const defaultValues: ProductDetailFormValues = {
    name: product?.name || "",
    productCode: product?.productCode || "",
    productSku: product?.productSku || "",
    price: Number(product?.price ?? 0),
    vatRate: Number(product?.vatRate ?? 0),
    startingInventory: product?.startingInventory || 0,
    minimumStockToNotify: product?.minimumStockToNotify || 0,
    categoryId: product?.categoryId || "",
    subCategoryId: product?.subCategoryId || "",
    brandId: product?.brandId || "",
    measurementUnitId: product?.measurementUnitId || "",
    isNew: product?.isNew ?? false,
    isBestSeller: product?.isBestSeller ?? false,
    isActive: product?.isActive ?? true,
    isDeleted: product?.isDeleted ?? false,
    productAttributes: product?.productAttributes || [],
  };

  // Generate random barcode
  const generateBarcode = () => `BC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Submit handler
  const onSubmit = async (data: ProductDetailFormValues) => {
    const toastId = toast.loading(product ? "Updating..." : "Creating...");

    try {
      const payload: Partial<IProductDetail> = {
        ...data,
        productCode: data.productCode || undefined,
        productSku: data.productSku || undefined,
        subCategoryId: data.subCategoryId || undefined,
        measurementUnitId: data.measurementUnitId || undefined,
      };

      if (id) {
        await updateProduct({ id, requestData: payload }).unwrap();
      } else {
        await addProduct(payload).unwrap();
      }

      toast.success(product ? "Product updated successfully" : "Product created successfully", {
        id: toastId,
        position: "top-right",
      });

      navigate(`/${currentRole.toLowerCase()}/productdetails`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong", { id: toastId });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <Paper sx={{ overflow: "hidden", p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 4 }}>
        <PageHeader title={id ? "Edit Product" : "Create New Product"} subTitle="Enter product details" />
      </Box>

      <Box>
        <Form
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          resolver={zodResolver(ProductDetailSchema)}
          resetOnDefaultChange={true}
        >
          <ProductFormContent
            brands={brands}
            categories={categories}
            units={units}
            attributes={attributes}
            fetchSubCategories={fetchSubCategories}
            subCategories={subCategories}
            fetchAttributeValues={fetchAttributeValues}
            generateBarcode={generateBarcode}
          />
        </Form>
      </Box>
    </Paper>
  );
};

export default ProductDetailEntry;