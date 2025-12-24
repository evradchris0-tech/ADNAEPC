import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import { CommitmentsClient } from "./commitments-client";

export default async function CommitmentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <CommitmentsClient />;
}
