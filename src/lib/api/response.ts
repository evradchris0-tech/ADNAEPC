import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<ApiResponse<T[]>> {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export function errorResponse(
  message: string,
  status = 400
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function validationErrorResponse(
  error: ZodError
): NextResponse<ApiResponse> {
  const errors: Record<string, string[]> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });

  return NextResponse.json(
    {
      success: false,
      error: "Erreur de validation",
      errors,
    },
    { status: 400 }
  );
}

export function unauthorizedResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: "Non autorisé" },
    { status: 401 }
  );
}

export function forbiddenResponse(): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: "Accès refusé" },
    { status: 403 }
  );
}

export function notFoundResponse(resource = "Ressource"): NextResponse<ApiResponse> {
  return NextResponse.json(
    { success: false, error: `${resource} non trouvé(e)` },
    { status: 404 }
  );
}

export function serverErrorResponse(error?: unknown): NextResponse<ApiResponse> {
  console.error("Server Error:", error);
  return NextResponse.json(
    { success: false, error: "Erreur serveur interne" },
    { status: 500 }
  );
}
