'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { authenticatedUser } = useAuth();

  useEffect(() => {
    // Redirige automáticamente a /dashboard
    return authenticatedUser 
      ? router.push('/dashboard')
      : router.push('/home');
  }, [router, authenticatedUser]);

  return null; // No necesitas renderizar nada ya que estás redirigiendo
}
