import prisma from "@/lib/db/prisma";
import { generateMatricule } from "@/lib/utils/matricule";
import type { CreateMemberInput, UpdateMemberInput } from "@/lib/validations/member";

/**
 * Récupère un membre avec toutes ses relations
 */
export async function getMemberById(id: string) {
  return await prisma.member.findUnique({
    where: { id },
    include: {
      associations: {
        include: {
          association: true,
        },
      },
      commitments: {
        include: {
          payments: true,
        },
        orderBy: { year: "desc" },
      },
      payments: {
        orderBy: { paymentDate: "desc" },
        take: 20,
      },
    },
  });
}

/**
 * Recherche par matricule
 */
export async function getMemberByMatricule(matricule: string) {
  return await prisma.member.findUnique({
    where: { matricule: matricule.toLowerCase() },
    include: {
      associations: {
        include: {
          association: true,
        },
      },
    },
  });
}

/**
 * Création avec génération matricule
 */
export async function createMember(data: CreateMemberInput) {
  const matricule = await generateMatricule();

  return await prisma.member.create({
    data: {
      ...data,
      matricule,
    },
    include: {
      associations: {
        include: {
          association: true,
        },
      },
    },
  });
}

/**
 * Mise à jour
 */
export async function updateMember(id: string, data: UpdateMemberInput) {
  return await prisma.member.update({
    where: { id },
    data,
    include: {
      associations: {
        include: {
          association: true,
        },
      },
    },
  });
}

/**
 * Suppression (vérifier pas d'engagements actifs)
 */
export async function deleteMember(id: string) {
  // Vérifier si le membre a des engagements actifs
  const currentYear = new Date().getFullYear();
  const activeCommitment = await prisma.commitment.findFirst({
    where: {
      memberId: id,
      year: currentYear,
    },
  });

  if (activeCommitment) {
    throw new Error("Impossible de supprimer un membre avec des engagements actifs");
  }

  return await prisma.member.delete({
    where: { id },
  });
}

/**
 * Ajout association
 */
export async function addMemberToAssociation(
  memberId: string,
  associationId: string,
  role?: string
) {
  // Vérifier si déjà membre
  const existing = await prisma.memberAssociation.findUnique({
    where: {
      memberId_associationId: {
        memberId,
        associationId,
      },
    },
  });

  if (existing) {
    throw new Error("Le membre appartient déjà à cette association");
  }

  return await prisma.memberAssociation.create({
    data: {
      memberId,
      associationId,
      role,
    },
    include: {
      association: true,
    },
  });
}

/**
 * Retrait d'une association
 */
export async function removeMemberFromAssociation(
  memberId: string,
  associationId: string
) {
  return await prisma.memberAssociation.delete({
    where: {
      memberId_associationId: {
        memberId,
        associationId,
      },
    },
  });
}

/**
 * Statistiques d'un membre
 */
export async function getMemberStats(id: string) {
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      commitments: {
        include: {
          payments: true,
        },
      },
      payments: true,
    },
  });

  if (!member) {
    throw new Error("Membre non trouvé");
  }

  // Calculer le total des engagements
  const totalCommitments = member.commitments.reduce(
    (sum, c) => sum + Number(c.totalCommitment),
    0
  );

  // Calculer le total versé
  const totalPaid = member.payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  // Engagement de l'année en cours
  const currentYear = new Date().getFullYear();
  const currentCommitment = member.commitments.find((c) => c.year === currentYear);

  return {
    totalCommitments,
    totalPaid,
    balance: totalCommitments - totalPaid,
    currentYearCommitment: currentCommitment
      ? Number(currentCommitment.totalCommitment)
      : 0,
    currentYearPaid: currentCommitment
      ? member.payments
          .filter((p) => p.commitmentId === currentCommitment.id)
          .reduce((sum, p) => sum + Number(p.amount), 0)
      : 0,
    totalCommitmentsCount: member.commitments.length,
    totalPaymentsCount: member.payments.length,
  };
}
