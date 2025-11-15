import { z } from 'zod';

export const brandFilterSchema = z.object({
  keyword: z
    .string()
    .optional()
    .transform((v) => v?.trim() ?? '')
    .refine((v) => v === '' || v.length >= 4, {
      message: 'Keyword must be at least 4 characters if provided',
    }),
  phone: z
    .string()
    .optional()
    .transform((v) => v?.trim() ?? '')
    .refine((v) => v === '' || /^(?:\+?88)?01[3-9]\d{8}$/.test(v), {
      message: 'Must be a valid Bangladeshi phone number',
    })
    .transform((val) => {
      if (!val) return '';
      // Keep in local 01XXXXXXXXX format
      if (val.startsWith('+88')) return val.slice(3); // remove +88
      if (val.startsWith('88')) return val.slice(2); // remove 88
      return val; // already local format
    }),
});
