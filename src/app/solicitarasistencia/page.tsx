// /app/solicitarasistencia/page.tsx

import React, { Suspense } from 'react';
import SolicitarAsistenciaForm from './SolicitarAsistenciaForm';

interface SolicitarAsistenciaPageProps {
  searchParams: {
    vehiculoId?: string;
  };
}

// Fuerza el renderizado dinámico para evitar problemas de pre-renderización
export const dynamic = 'force-dynamic';

const SolicitarAsistenciaPage: React.FC<SolicitarAsistenciaPageProps> = ({ searchParams }) => {
  const vehicleIdFromQuery = searchParams.vehiculoId || null;

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SolicitarAsistenciaForm vehicleIdFromQuery={vehicleIdFromQuery} />
    </Suspense>
  );
};

export default SolicitarAsistenciaPage;
