import { z } from "zod";
import { PaymentType } from "@/generated/prisma";

export const createPaymentSchema = z.object({
  memberId: z.string().cuid("ID membre invalide"),
  commitmentId: z.string().cuid("ID engagement invalide").optional(),
  paymentType: z.nativeEnum(PaymentType).default(PaymentType.CASH),
  amount: z.coerce
    .number()
    .positive("Le montant doit être supérieur à 0"),
  paymentDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : new Date())),
  reference: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

export const updatePaymentSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  paymentType: z.nativeEnum(PaymentType).optional(),
  paymentDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  reference: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

export const paymentFilterSchema = z.object({
  memberId: z.string().cuid().optional(),
  commitmentId: z.string().cuid().optional(),
  paymentType: z.nativeEnum(PaymentType).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type PaymentFilterInput = z.infer<typeof paymentFilterSchema>;
