import { z } from "zod";

export const createAssociationSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(255, "Le nom ne peut pas dépasser 255 caractères"),
  description: z.string().max(1000).optional(),
});

export const updateAssociationSchema = createAssociationSchema.partial();

export const associationFilterSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateAssociationInput = z.infer<typeof createAssociationSchema>;
export type UpdateAssociationInput = z.infer<typeof updateAssociationSchema>;
export type AssociationFilterInput = z.infer<typeof associationFilterSchema>;
