import { auth } from "./index";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function hasPermission(permission: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.permissions.includes(permission);
}

export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return user.role === role;
}

export async function hasAnyPermission(permissions: string[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return permissions.some((permission) => user.permissions.includes(permission));
}

export async function hasAllPermissions(permissions: string[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return permissions.every((permission) => user.permissions.includes(permission));
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}
