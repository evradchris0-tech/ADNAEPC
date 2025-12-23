import { NextRequest } from "next/server";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@/generated/prisma";
import {
  successResponse,
  paginatedResponse,
  validationErrorResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api/response";
import { checkPermission } from "@/lib/api/auth-check";
import { createPaymentSchema, paymentFilterSchema } from "@/lib/validations/payment";

// GET /api/payments
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkPermission("payments.view");
    if (!authCheck.authorized) return authCheck.response;

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const filterResult = paymentFilterSchema.safeParse(searchParams);

    if (!filterResult.success) {
      return validationErrorResponse(filterResult.error);
    }

    const { memberId, commitmentId, paymentType, startDate, endDate, page, limit } = filterResult.data;

    const where = {
      ...(memberId && { memberId }),
      ...(commitmentId && { commitmentId }),
      ...(paymentType && { paymentType }),
      ...(startDate || endDate
        ? {
            paymentDate: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return paginatedResponse(payments, page, limit, total);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// POST /api/payments
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkPermission("payments.create");
    if (!authCheck.authorized) return authCheck.response;

    const body = await request.json();
    const validationResult = createPaymentSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const data = validationResult.data;

    // Vérifier que le membre existe
    const member = await prisma.member.findUnique({
      where: { id: data.memberId },
    });

    if (!member) {
      return errorResponse("Membre non trouvé");
    }

    // Vérifier que l'engagement existe si fourni
    if (data.commitmentId) {
      const commitment = await prisma.commitment.findUnique({
        where: { id: data.commitmentId },
      });

      if (!commitment) {
        return errorResponse("Engagement non trouvé");
      }
    }

    const payment = await prisma.payment.create({
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
        member: true,
        commitment: true,
      },
    });

    return successResponse(payment, 201);
  } catch (error) {
    return serverErrorResponse(error);
  }
}
