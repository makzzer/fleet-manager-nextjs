'use client';

import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authenticatedUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Si no hay usuario autenticado, redirigir al login
    if (!authenticatedUser) {
      router.push('/login'); // Cambia la ruta al login
    }
  }, [authenticatedUser, router]);

  // Si hay un usuario autenticado, renderizamos la página protegida
  return authenticatedUser ? <>{children}</> : null;
};

export default ProtectedRoute;