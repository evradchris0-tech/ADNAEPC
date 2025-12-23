import prisma from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma";
import type { CreatePaymentInput } from "@/lib/validations/payment";

/**
 * Création avec transaction et validation
 */
export async function createPayment(data: CreatePaymentInput) {
  // Vérifier que le membre existe
  const member = await prisma.member.findUnique({
    where: { id: data.memberId },
  });

  if (!member) {
    throw new Error("Membre non trouvé");
  }

  // Si un engagement est spécifié, vérifier et valider le montant
  if (data.commitmentId) {
    const commitment = await prisma.commitment.findUnique({
      where: { id: data.commitmentId },
      include: {
        payments: true,
      },
    });

    if (!commitment) {
      throw new Error("Engagement non trouvé");
    }

    // Calculer le reste à payer
    const totalCommitted = Number(commitment.totalCommitment);
    const totalPaid = commitment.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const remaining = totalCommitted - totalPaid;

    // Vérifier que le montant ne dépasse pas le reste à payer
    if (data.amount > remaining) {
      throw new Error(
        `Le montant (${data.amount}) dépasse le reste à payer (${remaining.toFixed(2)})`
      );
    }
  }

  // Créer le paiement
  return await prisma.payment.create({
    data: {
      memberId: data.memberId,
      commitmentId: data.commitmentId,
      paymentType: data.paymentType,
      amount: new Prisma.Decimal(data.amount),
      paymentDate: data.paymentDate,
      reference: data.reference,
      notes: data.notes,
    },
    include: {
      member: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          matricule: true,
        },
      },
      commitment: true,
    },
  });
}

/**
 * Historique des paiements d'un membre
 */
export async function getPaymentsByMember(memberId: string, year?: number) {
  const where: Prisma.PaymentWhereInput = {
    memberId,
    ...(year && {
      commitment: {
        year,
      },
    }),
  };

  return await prisma.payment.findMany({
    where,
    include: {
      commitment: {
        select: {
          id: true,
          year: true,
        },
      },
    },
    orderBy: { paymentDate: "desc" },
  });
}

/**
 * Paiements d'un engagement
 */
export async function getPaymentsByCommitment(commitmentId: string) {
  return await prisma.payment.findMany({
    where: { commitmentId },
    include: {
      member: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          matricule: true,
        },
      },
    },
    orderBy: { paymentDate: "desc" },
  });
}

/**
 * Paiements du jour
 */
export async function getDailyPayments(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await prisma.payment.findMany({
    where: {
      paymentDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      member: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          matricule: true,
        },
      },
      commitment: {
        select: {
          id: true,
          year: true,
        },
      },
    },
    orderBy: { paymentDate: "desc" },
  });
}

/**
 * Statistiques des paiements sur une période
 */
export async function getPaymentStats(
  startDate: Date,
  endDate: Date
) {
  const payments = await prisma.payment.findMany({
    where: {
      paymentDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      commitment: true,
    },
  });

  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  // Grouper par type de paiement
  const byType = payments.reduce((acc, p) => {
    const type = p.paymentType;
    if (!acc[type]) {
      acc[type] = { count: 0, amount: 0 };
    }
    acc[type].count++;
    acc[type].amount += Number(p.amount);
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  // Grouper par jour
  const byDay = payments.reduce((acc, p) => {
    const day = p.paymentDate.toISOString().split("T")[0];
    if (!acc[day]) {
      acc[day] = { count: 0, amount: 0 };
    }
    acc[day].count++;
    acc[day].amount += Number(p.amount);
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  return {
    totalPayments: payments.length,
    totalAmount,
    averageAmount: payments.length > 0 ? totalAmount / payments.length : 0,
    byType,
    byDay,
    dateRange: {
      start: startDate,
      end: endDate,
    },
  };
}

/**
 * Supprimer un paiement
 */
export async function deletePayment(id: string) {
  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment) {
    throw new Error("Paiement non trouvé");
  }

  return await prisma.payment.delete({
    where: { id },
  });
}
