import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  errorResponse,
  serverErrorResponse,
} from '@/lib/api/response';
import { checkPermission } from '@/lib/api/auth-check';
import { updateCommitmentSchema } from '@/lib/validations/commitment';

type Params = { params: Promise<{ id: string }> };

// GET /api/commitments/[id] - Détails d'un engagement
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission('read:commitments');
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;

    const commitment = await prisma.commitment.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            matricule: true,
            phone: true,
            email: true,
            category: true,
            situation: true,
          },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
          select: {
            id: true,
            amount: true,
            paymentType: true,
            paymentDate: true,
            reference: true,
          },
        },
      },
    });

    if (!commitment) {
      return notFoundResponse('Engagement');
    }

    // Calculer les totaux des paiements
    const totalPaid = commitment.payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );

    const totalCommitted = Number(commitment.totalCommitment);
    const balance = totalCommitted - totalPaid;
    const completionRate = totalCommitted > 0 ? (totalPaid / totalCommitted) * 100 : 0;

    return successResponse({
      ...commitment,
      totalPaid,
      balance,
      completionRate: Math.round(completionRate * 100) / 100,
    });
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// PATCH /api/commitments/[id] - Modifier un engagement
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission('write:commitments');
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await request.json();
    const validationResult = updateCommitmentSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const existing = await prisma.commitment.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('Engagement');
    }

    // Recalculer le total si les montants changent
    const data = validationResult.data;
    const totalCommitment =
      (data.titheAmount ?? Number(existing.titheAmount)) +
      (data.constructionAmount ?? Number(existing.constructionAmount)) +
      (data.debtAmount ?? Number(existing.debtAmount));

    const commitment = await prisma.commitment.update({
      where: { id },
      data: {
        ...data,
        totalCommitment,
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
      },
    });

    return successResponse(commitment);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// DELETE /api/commitments/[id] - Supprimer un engagement
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission('delete:commitments');
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;

    const existing = await prisma.commitment.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });

    if (!existing) {
      return notFoundResponse('Engagement');
    }

    // Vérifier s'il y a des paiements associés
    if (existing.payments.length > 0) {
      return errorResponse(
        'Impossible de supprimer cet engagement car il contient des versements. Supprimez d\'abord les versements.',
        400
      );
    }

    await prisma.commitment.delete({ where: { id } });

    return successResponse({ message: 'Engagement supprimé avec succès' });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
