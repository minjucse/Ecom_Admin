import { z } from "zod";

export const supplierSchema = z.object({
  companyName: z
    .string()
    .trim()
    .nonempty("Company name is required")
    .min(2, "Company name must be at least 2 characters long.")
    .max(100, "Company name must be within 100 characters."),

  name: z
    .string()
    .trim()
    .nonempty("Supplier name is required")
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Supplier name cannot exceed 100 characters"),


  streetAddress: z
    .string()
    .max(200, "Street address too long.")
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),

  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Must be a valid Bangladeshi phone number")
    .transform((val) => {
      if (!val) return "";
      if (val.startsWith("+88")) return val.slice(3);
      if (val.startsWith("88")) return val.slice(2);

      return val;
    }),

  country: z
    .string()
    .min(2, "Country name must be at least 2 characters.")
    .max(100)
    .optional()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),


  contactPersonName: z
    .string()
    .min(2, "Contact person name must be at least 2 characters.")
    .max(100)
    .optional()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),

  contactPersonDesignation: z
    .string()
    .max(100, "Designation too long.")
    .optional()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),

  email: z
    .string()
    .trim()
    .nonempty("Email is required")
    .email("Invalid email format")
    .toLowerCase(),

  remarks: z
    .string()
    .max(500, "Remarks too long.")
    .optional()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),

  // ✅ Base properties
  isActive: z.boolean().default(true).optional(),
  isDeleted: z.boolean().default(false).optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
