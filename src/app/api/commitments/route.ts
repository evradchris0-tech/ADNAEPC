import { NextRequest } from "next/server";
import prisma from "@/lib/db/prisma";
import {
  successResponse,
  paginatedResponse,
  validationErrorResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api/response";
import { checkPermission } from "@/lib/api/auth-check";
import { createCommitmentSchema, commitmentFilterSchema } from "@/lib/validations/commitment";

// GET /api/commitments
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkPermission("commitments:read");
    if (!authCheck.authorized) return authCheck.response;

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const filterResult = commitmentFilterSchema.safeParse(searchParams);

    if (!filterResult.success) {
      return validationErrorResponse(filterResult.error);
    }

    const { memberId, year, page, limit } = filterResult.data;

    const where = {
      ...(memberId && { memberId }),
      ...(year && { year }),
    };

    const [commitments, total] = await Promise.all([
      prisma.commitment.findMany({
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
          _count: {
            select: { payments: true },
          },
        },
        orderBy: [{ year: "desc" }, { member: { lastName: "asc" } }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.commitment.count({ where }),
    ]);

    return paginatedResponse(commitments, page, limit, total);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// POST /api/commitments
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkPermission("commitments:write");
    if (!authCheck.authorized) return authCheck.response;

    const body = await request.json();
    const validationResult = createCommitmentSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const data = validationResult.data;

    // Vérifier qu'il n'existe pas déjà un engagement pour ce membre cette année
    const existing = await prisma.commitment.findUnique({
      where: {
        memberId_year: {
          memberId: data.memberId,
          year: data.year,
        },
      },
    });

    if (existing) {
      return errorResponse("Un engagement existe déjà pour ce membre cette année");
    }

    // Calculer le total
    const totalCommitment = data.titheAmount + data.constructionAmount + data.debtAmount;

    const commitment = await prisma.commitment.create({
      data: {
        ...data,
        totalCommitment,
      },
      include: {
        member: true,
      },
    });

    return successResponse(commitment, 201);
  } catch (error) {
    return serverErrorResponse(error);
  }
}
