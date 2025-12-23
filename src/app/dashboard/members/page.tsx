import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import { MembersClient } from "./members-client";

export default async function MembersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <MembersClient />;
}
