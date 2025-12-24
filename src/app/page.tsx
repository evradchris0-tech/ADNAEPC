import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ADNAEPC Church Management System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Système de gestion d'église Next.js 15
        </p>
        <Link href="/login">
          <Button size="lg" className="px-8 py-6 text-lg">
            Se connecter
          </Button>
        </Link>
      </div>
    </div>
  );
}
