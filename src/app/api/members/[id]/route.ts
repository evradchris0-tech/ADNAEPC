import { NextRequest } from "next/server";
import prisma from "@/lib/db/prisma";
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  serverErrorResponse,
} from "@/lib/api/response";
import { checkPermission } from "@/lib/api/auth-check";
import { updateMemberSchema } from "@/lib/validations/member";

type Params = { params: Promise<{ id: string }> };

// GET /api/members/[id] - Détails d'un membre
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission("members.view");
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;

    const member = await prisma.member.findUnique({
      where: { id },
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
      },
    });

    if (!member) {
      return notFoundResponse("Membre");
    }

    return successResponse(member);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// PATCH /api/members/[id] - Modifier un membre
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission("members.edit");
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;
    const body = await request.json();
    const validationResult = updateMemberSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse(validationResult.error);
    }

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("Membre");
    }

    const member = await prisma.member.update({
      where: { id },
      data: validationResult.data,
      include: {
        associations: {
          include: {
            association: true,
          },
        },
      },
    });

    return successResponse(member);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

// DELETE /api/members/[id] - Supprimer un membre
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const authCheck = await checkPermission("members.delete");
    if (!authCheck.authorized) return authCheck.response;

    const { id } = await params;

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse("Membre");
    }

    await prisma.member.delete({ where: { id } });

    return successResponse({ message: "Membre supprimé avec succès" });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
