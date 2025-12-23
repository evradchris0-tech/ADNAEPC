import { auth } from "@/lib/auth";
import { unauthorizedResponse, forbiddenResponse } from "./response";

export async function checkAuth() {
  const session = await auth();

  if (!session?.user) {
    return { authorized: false as const, response: unauthorizedResponse() };
  }

  return { authorized: true as const, user: session.user };
}

export async function checkPermission(permission: string) {
  const authResult = await checkAuth();

  if (!authResult.authorized) {
    return authResult;
  }

  if (!authResult.user.permissions.includes(permission)) {
    return { authorized: false as const, response: forbiddenResponse() };
  }

  return authResult;
}

export async function checkAnyPermission(permissions: string[]) {
  const authResult = await checkAuth();

  if (!authResult.authorized) {
    return authResult;
  }

  const hasAny = permissions.some((p) => authResult.user.permissions.includes(p));

  if (!hasAny) {
    return { authorized: false as const, response: forbiddenResponse() };
  }

  return authResult;
}
