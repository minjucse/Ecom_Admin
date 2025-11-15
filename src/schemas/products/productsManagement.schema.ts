import { z } from "zod";

export const categorySchema = z.object({
  name: z.string()
    .min(1, "Category name is required")
    .max(100)
    .trim(),
  
  isActive: z.boolean().default(true).optional(),
  isDeleted: z.boolean().default(false).optional(),
});


export const subCategorySchema = z.object({
  name: z.string()
    .min(1, "Sub-category name is required")
    .max(100)
    .trim(),

  // slug: z.string()
  //   .max(100)
  //   .optional()
  //   .transform((val) => (val === "" ? undefined : val)),

  description: z.string()
    .max(500)
    .optional()
   .transform((val) => (val === "" ? undefined : val)),

  categoryId: z.string()
    .min(1, "Category ID is required"),

  isActive: z.boolean().default(true).optional(),
  isDeleted: z.boolean().default(false).optional(),
});



export const sizeSchema = z.object({
  name: z.string()
    .min(1, "Size name is required")
    .max(50)
    .trim(),

  isActive: z.boolean().default(true).optional(),
  isDeleted: z.boolean().default(false).optional(),
});


export const colorSchema = z.object({
  name: z.string()
    .min(1, "Color name is required")
    .max(50)
    .trim(),

  hexCode: z.string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Must be a valid hex color code")
    .transform((val) => (val === "" ? undefined : val)),

  isActive: z.boolean().default(true).optional(),
  isDeleted: z.boolean().default(false).optional(),
});


export type CategoryFormValues = z.infer<typeof categorySchema>;
export type SubCategoryFormValues = z.infer<typeof subCategorySchema>;
export type SizeFormValues = z.infer<typeof sizeSchema>;
export type ColorFormValues = z.infer<typeof colorSchema>;