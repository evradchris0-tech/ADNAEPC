import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import { AssociationsClient } from "./associations-client";

export default async function AssociationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <AssociationsClient />;
}
