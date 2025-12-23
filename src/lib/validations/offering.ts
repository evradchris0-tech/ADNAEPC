import { z } from "zod";

export const createOfferingSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
  serviceType: z.string().min(1, "Le type de service est requis").max(100),
  amount: z.coerce.number().positive("Le montant doit être supérieur à 0"),
  notes: z.string().max(1000).optional(),
});

export const updateOfferingSchema = createOfferingSchema.partial();

export const offeringFilterSchema = z.object({
  serviceType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateOfferingInput = z.infer<typeof createOfferingSchema>;
export type UpdateOfferingInput = z.infer<typeof updateOfferingSchema>;
export type OfferingFilterInput = z.infer<typeof offeringFilterSchema>;
