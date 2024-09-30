'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authenticatedUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Esperar a que termine de cargar el estado del usuario
    if (!isLoading && !authenticatedUser) {
      router.push('/login'); // Redirigir al login si no está autenticado
    }
  }, [authenticatedUser, isLoading, router]);

  // Mientras está cargando, puedes mostrar un indicador de carga o nada
  if (isLoading) {
    return <div>Cargando...</div>; // Puedes personalizar este mensaje de carga
  }

  // Si hay un usuario autenticado, renderizamos la página protegida
  return authenticatedUser ? <>{children}</> : null;
};

export default ProtectedRoute;