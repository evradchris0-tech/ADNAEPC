import { NextRequest } from "next/server";
import prisma from "@/lib/db/prisma";
import {
  successResponse,
  paginatedResponse,
  validationErrorResponse,
  serverErrorResponse,
} from "@/lib/api/response";
import { checkPermission } from "@/lib/api/auth-check";
import { createMemberSchema, memberFilterSchema } from "@/lib/validations/member";
import { generateMatricule } from "@/lib/utils/matricule";

// GET /api/members - Liste des membres avec pagination et filtres
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkPermission("members.view");
    if (!authCheck.authorized) return authCheck.response;

    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const filterResult = memberFilterSchema.safeParse(searchParams);

    if (!filterResult.success) {
      return validationErrorResponse(filterResult.error);
    }

    const { search, category, situation, membershipStatus, gender, page, limit, sortBy, sortOrder } =
      filterResult.data;

    const where = {
      ...(search && {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { matricule: { contains: search } },
          { phone: { contains: search } },
        ],
      }),
      ...(category && { category }),
      ...(situation && { situation }),
      ...(membershipStatus && { membershipStatus }),
      ...(gender && { gender }),
    };

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        include: {
          associations: {
            include: {
              association: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.member.count({ where }),
    ]);

    return paginatedResponse(members, page, limit, total);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// POST /api/members - Créer un membre
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkPermission("members.create");
    if (!authCheck.authorized) return authCheck.response;

    const body = await request.json();
    const validationResult = createMemberSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const data = validationResult.data;
    const matricule = await generateMatricule();

    const member = await prisma.member.create({
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

    return successResponse(member, 201);
  } catch (error) {
    return serverErrorResponse(error);
  }
}
