import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import { PaymentsClient } from "./payments-client";

export default async function PaymentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <PaymentsClient />;
}
