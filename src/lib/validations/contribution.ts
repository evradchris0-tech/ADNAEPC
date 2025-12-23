import { z } from "zod";

export const createContributionSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(255),
  description: z.string().max(1000).optional(),
  targetAmount: z.coerce.number().positive("Le montant doit être supérieur à 0").optional(),
  collectedAmount: z.coerce.number().min(0).default(0),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  isActive: z.boolean().default(true),
});

export const updateContributionSchema = createContributionSchema.partial();

export const contributionFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateContributionInput = z.infer<typeof createContributionSchema>;
export type UpdateContributionInput = z.infer<typeof updateContributionSchema>;
export type ContributionFilterInput = z.infer<typeof contributionFilterSchema>;
