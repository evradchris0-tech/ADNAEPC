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
import { createAssociationSchema, associationFilterSchema } from "@/lib/validations/association";

// GET /api/associations
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkPermission("associations:read");
    if (!authCheck.authorized) return authCheck.response;

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const filterResult = associationFilterSchema.safeParse(searchParams);

    if (!filterResult.success) {
      return validationErrorResponse(filterResult.error);
    }

    const { search, page, limit } = filterResult.data;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [associations, total] = await Promise.all([
      prisma.association.findMany({
        where,
        include: {
          _count: {
            select: { members: true },
          },
        },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.association.count({ where }),
    ]);

    return paginatedResponse(associations, page, limit, total);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// POST /api/associations
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkPermission("associations:write");
    if (!authCheck.authorized) return authCheck.response;

    const body = await request.json();
    const validationResult = createAssociationSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    // Vérifier l'unicité du nom
    const existing = await prisma.association.findUnique({
      where: { name: validationResult.data.name },
    });

    if (existing) {
      return errorResponse("Une association avec ce nom existe déjà");
    }

    const association = await prisma.association.create({
      data: validationResult.data,
    });

    return successResponse(association, 201);
  } catch (error) {
    return serverErrorResponse(error);
  }
}
