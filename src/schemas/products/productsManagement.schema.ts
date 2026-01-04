import { z } from "zod";

/* =======================
   CATEGORY
======================= */
export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100),

  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

/* =======================
   SUB CATEGORY
======================= */
export const subCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Sub-category name is required")
    .max(100),

  description: z
    .string()
    .max(500)
    .optional()
    .transform((v) => (v?.trim() === "" ? undefined : v)),

  categoryId: z.string().min(1, "Category ID is required"),

  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

/* =======================
   SIZE
======================= */
export const sizeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Size name is required")
    .max(50),

  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

/* =======================
   COLOR
======================= */
export const colorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Color name is required")
    .max(50),

  hexCode: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Invalid hex color")
    .optional()
    .transform((v) => (v?.trim() === "" ? undefined : v)),

  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

/* =======================
   MEASUREMENT
======================= */
export const measurementSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Measurement name is required")
    .max(20),

  measurementUnitSymbol: z
    .string()
    .max(10)
    .optional()
    .transform((v) => (v?.trim() === "" ? undefined : v)),

  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

/* =======================
   ATTRIBUTE
======================= */
export const attributeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Attribute name is required")
    .max(50),

  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

/* =======================
   ATTRIBUTE VALUE
======================= */
export const attributeValueSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Attribute value name is required")
    .max(50),

  value: z.string().optional().nullable(),

  attributeGroupId: z.string().min(1, "Attribute group ID is required"),

  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

export const productAttributeValueSchema = z.object({
  attributeValueId: z.string().min(1, "Required"),
  attributeValueName: z.string(),
  attributeGroupId: z.string().optional(),
  attributeGroupName: z.string().optional(),
});

export const productAttributeFormSchema = z.object({
  attributes: z.array(productAttributeValueSchema).min(1, "At least one attribute is required"),
  barCode: z.string().optional().nullable().transform((v) => v ?? ""),
  startingInventory: z.number().min(0),
  minimumStockToNotify: z.number().min(0),
});


/* =======================
   PRODUCT
======================= */
export const ProductDetailSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(100),
  productCode: z.string().nullable().optional(),
  productSku: z.string().nullable().optional(),
  price: z.number().min(0),
  vatRate: z.number().min(0),
  startingInventory: z.number().min(0),
  minimumStockToNotify: z.number().min(0),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().min(1, "Sub-category is required"),
  brandId: z.string().min(1, "Brand is required"),
  measurementUnitId: z.string().optional(),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isActive: z.boolean().default(true).optional(),
  isDeleted: z.boolean().default(false).optional(),
  productAttributes: z.array(productAttributeFormSchema).default([]),
});



/* =======================
   TYPES
======================= */
export type CategoryFormValues = z.infer<typeof categorySchema>;
export type SubCategoryFormValues = z.infer<typeof subCategorySchema>;
export type SizeFormValues = z.infer<typeof sizeSchema>;
export type ColorFormValues = z.infer<typeof colorSchema>;
export type MeasurementFormValues = z.infer<typeof measurementSchema>;
export type AttributeFormValues = z.infer<typeof attributeSchema>;
export type AttributeValueFormValues = z.infer<typeof attributeValueSchema>;
export type ProductDetailFormValues = z.infer<typeof ProductDetailSchema>;
export type ProductAttributeFormValues = z.infer<typeof productAttributeFormSchema>;
