import prisma from "@/lib/db/prisma";

/**
 * Génère un nouveau matricule unique au format XXX-YY
 * XXX: nombre de 000 à 999
 * YY: lettres de aa à zz
 */
export async function generateMatricule(): Promise<string> {
  // Récupérer le dernier matricule
  const lastMember = await prisma.member.findFirst({
    orderBy: { createdAt: "desc" },
    select: { matricule: true },
  });

  if (!lastMember?.matricule) {
    return "000-aa";
  }

  const [numStr, letters] = lastMember.matricule.toLowerCase().split("-");
  let num = parseInt(numStr ?? "0", 10);
  let letter1 = letters?.charCodeAt(0) ?? 97; // 'a' = 97
  let letter2 = letters?.charCodeAt(1) ?? 97;

  // Incrémenter
  num++;

  if (num > 999) {
    num = 0;
    letter2++;

    if (letter2 > 122) {
      // > 'z'
      letter2 = 97; // 'a'
      letter1++;

      if (letter1 > 122) {
        throw new Error("Capacité maximale de matricules atteinte");
      }
    }
  }

  const newNum = num.toString().padStart(3, "0");
  const newLetters = String.fromCharCode(letter1) + String.fromCharCode(letter2);

  return `${newNum}-${newLetters}`;
}

/**
 * Vérifie si un matricule existe déjà
 */
export async function matriculeExists(matricule: string): Promise<boolean> {
  const member = await prisma.member.findUnique({
    where: { matricule: matricule.toLowerCase() },
  });
  return !!member;
}
