import { NextRequest } from "next/server";
import prisma from "@/lib/db/prisma";
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  serverErrorResponse,
} from "@/lib/api/response";
import { checkPermission } from "@/lib/api/auth-check";
import { updateAssociationSchema } from "@/lib/validations/association";

type Params = { params: Promise<{ id: string }> };

// GET /api/associations/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission("associations:read");
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;

    const association = await prisma.association.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            member: true,
          },
        },
        _count: {
          select: { members: true },
        },
      },
    });

    if (!association) {
      return notFoundResponse("Association");
    }

    return successResponse(association);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// PATCH /api/associations/[id]
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission("associations:write");
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await request.json();
    const validationResult = updateAssociationSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const existing = await prisma.association.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("Association");
    }

    const association = await prisma.association.update({
      where: { id },
      data: validationResult.data,
    });

    return successResponse(association);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// DELETE /api/associations/[id]
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission("associations:delete");
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;

    const existing = await prisma.association.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("Association");
    }

    await prisma.association.delete({ where: { id } });

    return successResponse({ message: "Association supprimée avec succès" });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
