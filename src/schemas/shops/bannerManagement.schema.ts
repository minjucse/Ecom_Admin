import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/.test(val), {
    message: "Must be a valid URL",
  });
export const bannerSchema = z.object({
  name: z.string()
    .trim()
    .min(3, { message: "Banner name is required" })
    .max(20, { message: "Banner name cannot exceed 20 characters" }),

  // if it's a file upload:
  imgPath: z.any().optional(), // or use z.instanceof(File).optional()

  imageUrl: optionalUrl,

  isActive: z.boolean().default(true).optional(),
  isDeleted: z.boolean().default(false).optional(),
}).strict();

export type BannerFormValues = z.infer<typeof bannerSchema>;
