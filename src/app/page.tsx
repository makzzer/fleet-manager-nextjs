'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirige automáticamente a /dashboard
    router.push('/dashboard');
  }, [router]);

  return null; // No necesitas renderizar nada ya que estás redirigiendo
}
