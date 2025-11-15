import { z } from "zod";

export const brandSchema = z.object({
  name: z.string()
    .min(1, "Brand name is required")
    .max(100)
    .trim(),

  brandCode: z.string()
    .max(50)
    .optional()
    .transform(val => val || undefined),

  address: z.string()
    .max(500)
    .optional()
    .transform(val => val || undefined),

  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Must be a valid Bangladeshi phone number")
    .transform((val) => {
      if (!val) return '';
      // Keep in local 01XXXXXXXXX format
      if (val.startsWith('+88')) return val.slice(3); // remove +88
      if (val.startsWith('88')) return val.slice(2); // remove 88
      return val; // already local format
    }),
  
  contactPersonName: z.string()
    .max(100)
    .optional()
    .transform(val => val || undefined),

  country: z.string()
    .max(100)
    .optional()
    .transform(val => val || undefined),

  madeInCountry: z.string()
    .max(100)
    .optional()
    .transform(val => val || undefined),

  email: z.string()
    .min(1, "Email is required")
    .email()
    .toLowerCase()
    .trim(),

  remarks: z.string()
    .max(1000)
    .optional()
    .transform(val => val || undefined),

  isActive: z.boolean().default(true).optional(),
  isDeleted: z.boolean().default(false).optional(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
