import { z } from "zod";
import dayjs from "dayjs";
const optionalUrl = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/.test(val), {
    message: "Must be a valid URL",
  });

export const shopSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100)
    .trim(),

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

  streetAddress: z.string().max(500).transform(v => v?.trim() || undefined).optional(),

  contactPersonName: z.string().max(100).transform(v => v?.trim() || undefined).optional(),

  contactPersonPhone: z.string()
    .transform(v => (v === "" ? undefined : v))
    .optional()
    .refine((val) => !val || /^(?:\+?88)?01[3-9]\d{8}$/.test(val), {
      message: "Must be a valid Bangladeshi phone number",
    })
    .transform(val => {
      if (!val) return undefined;
      return val.startsWith("+88") ? val : `+88${val.replace(/^0/, "")}`;
    }),

  website: optionalUrl,
  facebook: optionalUrl,
  logoUrl: z.any().optional(),

  email: z.string()
    .min(1, "Email is required")
    .email("Must be a valid email")
    .toLowerCase()
    .trim(),

  accountNumber: z.string().max(100).transform(v => v?.trim() || undefined).optional(),

  remarks: z.string().max(1000).transform(v => v?.trim() || undefined).optional(),

  registrationDate: z
    .any()
    .transform((val) => (val ? dayjs(val) : null))
    .nullable(),
  expiryDate: z
    .any()
    .transform((val) => (val ? dayjs(val) : null))
    .nullable(),
});

export type shopFormValues = z.infer<typeof shopSchema>;
