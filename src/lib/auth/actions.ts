"use server";

import { signIn, signOut } from "./index";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { AuthError } from "next-auth";

export async function loginAction(values: LoginInput) {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Données invalides",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou mot de passe incorrect" };
        default:
          return { error: "Une erreur s'est produite" };
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
