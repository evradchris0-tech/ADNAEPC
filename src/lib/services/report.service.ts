import prisma from "@/lib/db/prisma";
import type { MemberFilterInput } from "@/lib/validations/member";

/**
 * Rapport individuel complet d'un membre
 */
export async function getMemberReport(memberId: string) {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
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
      },
    },
  });

  if (!member) {
    throw new Error("Membre non trouvé");
  }

  // Calculer les totaux
  const totalCommitments = member.commitments.reduce(
    (sum, c) => sum + Number(c.totalCommitment),
    0
  );

  const totalPaid = member.payments.reduce((sum, p) => sum + Number(p.amount), 0);

  // Par année
  const byYear = member.commitments.map((commitment) => {
    const yearPayments = member.payments.filter(
      (p) => p.commitmentId === commitment.id
    );
    const yearTotal = yearPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      year: commitment.year,
      committed: Number(commitment.totalCommitment),
      paid: yearTotal,
      balance: Number(commitment.totalCommitment) - yearTotal,
      paymentsCount: yearPayments.length,
    };
  });

  return {
    member,
    summary: {
      totalCommitments,
      totalPaid,
      balance: totalCommitments - totalPaid,
      yearsCount: member.commitments.length,
      totalPaymentsCount: member.payments.length,
    },
    byYear,
  };
}

/**
 * Rapport d'une association pour une année
 */
export async function getAssociationReport(associationId: string, year: number) {
  const association = await prisma.association.findUnique({
    where: { id: associationId },
    include: {
      members: {
        include: {
          member: {
            include: {
              commitments: {
                where: { year },
                include: {
                  payments: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!association) {
    throw new Error("Association non trouvée");
  }

  const memberStats = association.members.map((ma) => {
    const commitment = ma.member.commitments[0];
    if (!commitment) {
      return {
        member: ma.member,
        committed: 0,
        paid: 0,
        balance: 0,
        percentage: 0,
      };
    }

    const paid = commitment.payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const committed = Number(commitment.totalCommitment);

    return {
      member: ma.member,
      committed,
      paid,
      balance: committed - paid,
      percentage: committed > 0 ? (paid / committed) * 100 : 0,
    };
  });

  const totals = memberStats.reduce(
    (acc, m) => ({
      committed: acc.committed + m.committed,
      paid: acc.paid + m.paid,
      balance: acc.balance + m.balance,
    }),
    { committed: 0, paid: 0, balance: 0 }
  );

  return {
    association,
    year,
    memberCount: association.members.length,
    memberStats,
    totals: {
      ...totals,
      percentage: totals.committed > 0 ? (totals.paid / totals.committed) * 100 : 0,
    },
  };
}

/**
 * Rapport global de la paroisse pour une année
 */
export async function getGlobalReport(year: number) {
  const [commitments, payments, associations] = await Promise.all([
    prisma.commitment.findMany({
      where: { year },
      include: {
        member: true,
      },
    }),
    prisma.payment.findMany({
      where: {
        commitment: {
          year,
        },
      },
    }),
    prisma.association.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
    }),
  ]);

  const totalCommitted = commitments.reduce(
    (sum, c) => sum + Number(c.totalCommitment),
    0
  );

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  const totalTithe = commitments.reduce(
    (sum, c) => sum + Number(c.titheAmount),
    0
  );

  const totalConstruction = commitments.reduce(
    (sum, c) => sum + Number(c.constructionAmount),
    0
  );

  const totalDebt = commitments.reduce((sum, c) => sum + Number(c.debtAmount), 0);

  return {
    year,
    membersWithCommitments: commitments.length,
    associationsCount: associations.length,
    totals: {
      committed: totalCommitted,
      paid: totalPaid,
      balance: totalCommitted - totalPaid,
      percentage: totalCommitted > 0 ? (totalPaid / totalCommitted) * 100 : 0,
      tithe: totalTithe,
      construction: totalConstruction,
      debt: totalDebt,
    },
    paymentsCount: payments.length,
  };
}

/**
 * Rapport de performance (taux de réalisation)
 */
export async function getPerformanceReport(year: number) {
  const associations = await prisma.association.findMany({
    include: {
      members: {
        include: {
          member: {
            include: {
              commitments: {
                where: { year },
                include: {
                  payments: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const associationStats = associations.map((association) => {
    let totalCommitted = 0;
    let totalPaid = 0;

    association.members.forEach((ma) => {
      const commitment = ma.member.commitments[0];
      if (commitment) {
        totalCommitted += Number(commitment.totalCommitment);
        totalPaid += commitment.payments.reduce(
          (sum, p) => sum + Number(p.amount),
          0
        );
      }
    });

    return {
      associationId: association.id,
      name: association.name,
      memberCount: association.members.length,
      totalCommitted,
      totalPaid,
      balance: totalCommitted - totalPaid,
      percentage: totalCommitted > 0 ? (totalPaid / totalCommitted) * 100 : 0,
    };
  });

  // Trier par pourcentage décroissant
  associationStats.sort((a, b) => b.percentage - a.percentage);

  return {
    year,
    associations: associationStats,
    totals: associationStats.reduce(
      (acc, a) => ({
        committed: acc.committed + a.totalCommitted,
        paid: acc.paid + a.totalPaid,
        balance: acc.balance + a.balance,
      }),
      { committed: 0, paid: 0, balance: 0 }
    ),
  };
}

/**
 * Export des membres en CSV
 */
export async function exportMembersToCSV(filters?: MemberFilterInput) {
  const where = {
    ...(filters?.search && {
      OR: [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { matricule: { contains: filters.search } },
      ],
    }),
    ...(filters?.category && { category: filters.category }),
    ...(filters?.situation && { situation: filters.situation }),
    ...(filters?.membershipStatus && { membershipStatus: filters.membershipStatus }),
    ...(filters?.gender && { gender: filters.gender }),
  };

  const members = await prisma.member.findMany({
    where,
    orderBy: { lastName: "asc" },
  });

  // Créer le contenu CSV
  const headers = [
    "Matricule",
    "Nom",
    "Prénom",
    "Genre",
    "Date de naissance",
    "Téléphone",
    "Email",
    "Catégorie",
    "Situation",
    "Statut",
  ];

  const rows = members.map((m) => [
    m.matricule,
    m.lastName,
    m.firstName,
    m.gender,
    m.dateOfBirth?.toISOString().split("T")[0] || "",
    m.phone || "",
    m.email || "",
    m.category,
    m.situation,
    m.membershipStatus,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Export des paiements en CSV
 */
export async function exportPaymentsToCSV(
  startDate?: Date,
  endDate?: Date,
  memberId?: string
) {
  const where = {
    ...(startDate &&
      endDate && {
        paymentDate: {
          gte: startDate,
          lte: endDate,
        },
      }),
    ...(memberId && { memberId }),
  };

  const payments = await prisma.payment.findMany({
    where,
    include: {
      member: true,
      commitment: true,
    },
    orderBy: { paymentDate: "desc" },
  });

  const headers = [
    "Date",
    "Matricule",
    "Nom",
    "Prénom",
    "Montant",
    "Type",
    "Année engagement",
    "Référence",
    "Notes",
  ];

  const rows = payments.map((p) => [
    p.paymentDate.toISOString().split("T")[0],
    p.member.matricule,
    p.member.lastName,
    p.member.firstName,
    p.amount.toString(),
    p.paymentType,
    p.commitment?.year.toString() || "",
    p.reference || "",
    p.notes || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}
