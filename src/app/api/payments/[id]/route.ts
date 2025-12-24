import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api/response';
import { checkPermission } from '@/lib/api/auth-check';
import { updatePaymentSchema } from '@/lib/validations/payment';

type Params = { params: Promise<{ id: string }> };

// GET /api/payments/[id] - Détails d'un paiement
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission('read:payments');
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;

    const payment = await prisma.payment.findUnique({
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
          },
        },
        commitment: {
          select: {
            id: true,
            year: true,
            titheAmount: true,
            constructionAmount: true,
            debtAmount: true,
            totalCommitment: true,
          },
        },
      },
    });

    if (!payment) {
      return notFoundResponse('Paiement');
    }

    return successResponse(payment);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// PATCH /api/payments/[id] - Modifier un paiement
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission('write:payments');
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await request.json();
    const validationResult = updatePaymentSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const existing = await prisma.payment.findUnique({ where: { id } });

    if (!existing) {
      return notFoundResponse('Paiement');
    }

    const data = validationResult.data;

    // Construire les données de mise à jour
    const updateData: any = {};
    if (data.amount !== undefined) {
      updateData.amount = data.amount;
    }
    if (data.paymentType !== undefined) {
      updateData.paymentType = data.paymentType;
    }
    if (data.paymentDate) {
      updateData.paymentDate = data.paymentDate;
    }
    if (data.reference !== undefined) {
      updateData.reference = data.reference;
    }
    if (data.notes !== undefined) {
      updateData.notes = data.notes;
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        member: true,
        commitment: true,
      },
    });

    return successResponse(payment);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// DELETE /api/payments/[id] - Supprimer un paiement
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission('delete:payments');
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;

    const existing = await prisma.payment.findUnique({ where: { id } });

    if (!existing) {
      return notFoundResponse('Paiement');
    }

    await prisma.payment.delete({ where: { id } });

    return successResponse({ message: 'Paiement supprimé avec succès' });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
