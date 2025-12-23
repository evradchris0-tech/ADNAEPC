import { z } from "zod";

export const createCommitmentSchema = z.object({
  memberId: z.string().cuid("ID membre invalide"),
  year: z.coerce
    .number()
    .int()
    .min(2000, "Année invalide")
    .max(2100, "Année invalide"),
  titheAmount: z.coerce.number().min(0, "Le montant doit être positif").default(0),
  constructionAmount: z.coerce.number().min(0, "Le montant doit être positif").default(0),
  debtAmount: z.coerce.number().min(0, "Le montant doit être positif").default(0),
});

export const updateCommitmentSchema = z.object({
  titheAmount: z.coerce.number().min(0).optional(),
  constructionAmount: z.coerce.number().min(0).optional(),
  debtAmount: z.coerce.number().min(0).optional(),
});

export const commitmentFilterSchema = z.object({
  memberId: z.string().cuid().optional(),
  year: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Schema pour la migration annuelle des engagements
export const migrateCommitmentsSchema = z.object({
  fromYear: z.coerce.number().int(),
  toYear: z.coerce.number().int(),
});

export type CreateCommitmentInput = z.infer<typeof createCommitmentSchema>;
export type UpdateCommitmentInput = z.infer<typeof updateCommitmentSchema>;
export type CommitmentFilterInput = z.infer<typeof commitmentFilterSchema>;
export type MigrateCommitmentsInput = z.infer<typeof migrateCommitmentsSchema>;
