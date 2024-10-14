'use client';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';
/*coment para push test*/

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;  //esto le voy a mandar desde cada componente para validar acceso
}

const ProtectedRoute = ({ children, requiredModule }: ProtectedRouteProps) => {
  const { authenticatedUser, isLoading, hasModuleAccess } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Esperar a que termine de cargar el estado del usuario
    if (!isLoading) {
      if (!authenticatedUser) {
        router.push('/login'); // Redirigir al login si no está autenticado

      } else if (requiredModule && !hasModuleAccess(requiredModule)) {
        router.push('/dashboard'); // Redirigir al dashboard si no está autenticado

      }
    }
  }, [authenticatedUser, isLoading, router, requiredModule, hasModuleAccess]);

  // Mientras está cargando, puedes mostrar un indicador de carga o nada
  if (isLoading) {
    return <div>Cargando...</div>; // Puedes personalizar este mensaje de carga
  }

  // Si hay un usuario autenticado y tiene permisos, renderizamos la página protegida
  return authenticatedUser && (!requiredModule || hasModuleAccess(requiredModule)) ? <>{children}</> : null;
};

export default ProtectedRoute;