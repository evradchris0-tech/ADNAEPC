import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/lib/auth/actions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">ADNAEPC Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{session.user.name}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bienvenue, {session.user.name}!
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span> {session.user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Rôle:</span> {session.user.role}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Permissions:</span>{" "}
                {session.user.permissions.length > 0
                  ? session.user.permissions.join(", ")
                  : "Aucune"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
