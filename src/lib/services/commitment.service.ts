import prisma from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma";
import type { CreateCommitmentInput } from "@/lib/validations/commitment";

/**
 * Engagements de l'année en cours
 */
export async function getCurrentYearCommitments() {
  const currentYear = new Date().getFullYear();

  return await prisma.commitment.findMany({
    where: { year: currentYear },
    include: {
      member: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          matricule: true,
        },
      },
      payments: true,
    },
    orderBy: {
      member: {
        lastName: "asc",
      },
    },
  });
}

/**
 * Engagement spécifique d'un membre pour une année
 */
export async function getMemberCommitment(memberId: string, year: number) {
  return await prisma.commitment.findUnique({
    where: {
      memberId_year: {
        memberId,
        year,
      },
    },
    include: {
      member: true,
      payments: {
        orderBy: { paymentDate: "desc" },
      },
    },
  });
}

/**
 * Création d'un engagement
 */
export async function createCommitment(data: CreateCommitmentInput) {
  // Vérifier qu'il n'existe pas déjà
  const existing = await prisma.commitment.findUnique({
    where: {
      memberId_year: {
        memberId: data.memberId,
        year: data.year,
      },
    },
  });

  if (existing) {
    throw new Error("Un engagement existe déjà pour ce membre cette année");
  }

  // Calculer le total
  const totalCommitment = data.titheAmount + data.constructionAmount + data.debtAmount;

  return await prisma.commitment.create({
    data: {
      ...data,
      totalCommitment: new Prisma.Decimal(totalCommitment),
    },
    include: {
      member: true,
    },
  });
}

/**
 * Mise à jour des montants d'un engagement
 */
export async function updateCommitmentAmounts(
  id: string,
  data: {
    titheAmount?: number;
    constructionAmount?: number;
    debtAmount?: number;
  }
) {
  const commitment = await prisma.commitment.findUnique({
    where: { id },
  });

  if (!commitment) {
    throw new Error("Engagement non trouvé");
  }

  // Recalculer le total
  const titheAmount = data.titheAmount ?? Number(commitment.titheAmount);
  const constructionAmount = data.constructionAmount ?? Number(commitment.constructionAmount);
  const debtAmount = data.debtAmount ?? Number(commitment.debtAmount);

  const totalCommitment = titheAmount + constructionAmount + debtAmount;

  return await prisma.commitment.update({
    where: { id },
    data: {
      ...(data.titheAmount !== undefined && {
        titheAmount: new Prisma.Decimal(data.titheAmount),
      }),
      ...(data.constructionAmount !== undefined && {
        constructionAmount: new Prisma.Decimal(data.constructionAmount),
      }),
      ...(data.debtAmount !== undefined && {
        debtAmount: new Prisma.Decimal(data.debtAmount),
      }),
      totalCommitment: new Prisma.Decimal(totalCommitment),
    },
    include: {
      member: true,
    },
  });
}

/**
 * Calcul du solde d'un engagement (engagé - versé)
 */
export async function calculateCommitmentBalance(id: string) {
  const commitment = await prisma.commitment.findUnique({
    where: { id },
    include: {
      payments: true,
    },
  });

  if (!commitment) {
    throw new Error("Engagement non trouvé");
  }

  const totalCommitted = Number(commitment.totalCommitment);
  const totalPaid = commitment.payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  return {
    totalCommitted,
    totalPaid,
    balance: totalCommitted - totalPaid,
    percentage: totalCommitted > 0 ? (totalPaid / totalCommitted) * 100 : 0,
  };
}

/**
 * Migration annuelle des engagements
 * Reporte les dettes non payées et crée nouveaux engagements
 */
export async function migrateCommitmentsToNewYear(fromYear: number, toYear: number) {
  // Récupérer tous les engagements de l'année source
  const sourceCommitments = await prisma.commitment.findMany({
    where: { year: fromYear },
    include: {
      member: true,
      payments: true,
    },
  });

  const results = {
    migrated: 0,
    skipped: 0,
    errors: [] as string[],
  };

  for (const commitment of sourceCommitments) {
    try {
      // Vérifier si un engagement existe déjà pour cette année
      const existing = await prisma.commitment.findUnique({
        where: {
          memberId_year: {
            memberId: commitment.memberId,
            year: toYear,
          },
        },
      });

      if (existing) {
        results.skipped++;
        continue;
      }

      // Calculer les dettes
      const totalCommitted = Number(commitment.totalCommitment);
      const totalPaid = commitment.payments.reduce(
        (sum, p) => sum + Number(p.amount),
        0
      );
      const unpaidAmount = Math.max(0, totalCommitted - totalPaid);

      // Créer nouvel engagement avec dettes
      await prisma.commitment.create({
        data: {
          memberId: commitment.memberId,
          year: toYear,
          titheAmount: 0,
          constructionAmount: 0,
          debtAmount: new Prisma.Decimal(unpaidAmount),
          totalCommitment: new Prisma.Decimal(unpaidAmount),
        },
      });

      results.migrated++;
    } catch (error) {
      results.errors.push(
        `Erreur pour ${commitment.member.firstName} ${commitment.member.lastName}: ${error}`
      );
    }
  }

  return results;
}

/**
 * Statistiques globales des engagements
 */
export async function getCommitmentStats(year?: number) {
  const targetYear = year ?? new Date().getFullYear();

  const commitments = await prisma.commitment.findMany({
    where: { year: targetYear },
    include: {
      payments: true,
    },
  });

  const totalCommitted = commitments.reduce(
    (sum, c) => sum + Number(c.totalCommitment),
    0
  );

  const totalPaid = commitments.reduce(
    (sum, c) =>
      sum + c.payments.reduce((pSum, p) => pSum + Number(p.amount), 0),
    0
  );

  const totalTithe = commitments.reduce(
    (sum, c) => sum + Number(c.titheAmount),
    0
  );

  const totalConstruction = commitments.reduce(
    (sum, c) => sum + Number(c.constructionAmount),
    0
  );

  const totalDebt = commitments.reduce(
    (sum, c) => sum + Number(c.debtAmount),
    0
  );

  return {
    year: targetYear,
    totalCommitments: commitments.length,
    totalCommitted,
    totalPaid,
    balance: totalCommitted - totalPaid,
    percentage: totalCommitted > 0 ? (totalPaid / totalCommitted) * 100 : 0,
    totalTithe,
    totalConstruction,
    totalDebt,
  };
}
