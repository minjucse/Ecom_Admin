import { z } from 'zod';

export const productFilterSchema = z.object({
  keyword: z
    .string()
    .optional()
    .transform((v) => v?.trim() ?? '')
    .refine((v) => v === '' || v.length >= 3, {
      message: 'Keyword must be at least 3 characters if provided',
    }),
  productCode: z
    .string()
    .optional()
    .transform((v) => v?.trim() ?? ''),
});

