import { z } from "zod";
import { Gender, MaritalStatus, MemberCategory, MemberSituation, MembershipStatus } from "@/generated/prisma";

// Schema de base pour la création
export const createMemberSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100, "Le prénom ne peut pas dépasser 100 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  gender: z.nativeEnum(Gender),
  dateOfBirth: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  placeOfBirth: z.string().max(255).optional(),
  email: z.string().email("Format d'email invalide").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^(\+237|237)?[6-9]\d{8}$/, "Format de téléphone invalide")
    .optional()
    .or(z.literal("")),
  address: z.string().max(500).optional(),
  neighborhood: z.string().max(100).optional(),
  profession: z.string().max(100).optional(),
  maritalStatus: z.nativeEnum(MaritalStatus).default(MaritalStatus.SINGLE),
  baptismDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  baptismPlace: z.string().max(255).optional(),
  joinDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : new Date())),
  category: z.nativeEnum(MemberCategory).default(MemberCategory.ADULT),
  situation: z.nativeEnum(MemberSituation).default(MemberSituation.ACTIVE),
  membershipStatus: z.nativeEnum(MembershipStatus).default(MembershipStatus.VISITOR),
  photo: z.string().url().optional().or(z.literal("")),
  notes: z.string().max(1000).optional(),
});

// Schema pour la mise à jour (tous les champs optionnels)
export const updateMemberSchema = createMemberSchema.partial();

// Schema pour les filtres de recherche
export const memberFilterSchema = z.object({
  search: z.string().optional(),
  category: z.nativeEnum(MemberCategory).optional(),
  situation: z.nativeEnum(MemberSituation).optional(),
  membershipStatus: z.nativeEnum(MembershipStatus).optional(),
  gender: z.nativeEnum(Gender).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().default("lastName"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Schema pour l'ajout à une association
export const addMemberToAssociationSchema = z.object({
  memberId: z.string().cuid(),
  associationId: z.string().cuid(),
  role: z.string().max(100).optional(),
  joinDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : new Date())),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type MemberFilterInput = z.infer<typeof memberFilterSchema>;
export type AddMemberToAssociationInput = z.infer<typeof addMemberToAssociationSchema>;
