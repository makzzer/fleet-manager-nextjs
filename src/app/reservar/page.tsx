// /app/reservar/page.tsx

import React, { Suspense } from "react";
import ReservaViaje from "./ReservaViaje";

interface ReservaPageProps {
  searchParams: {
    vehiculoId?: string;
  };
}

// Force dynamic rendering to avoid pre-rendering issues with dynamic data
export const dynamic = "force-dynamic";

const ReservaPage: React.FC<ReservaPageProps> = ({ searchParams }) => {
  const vehicleIdFromQuery = searchParams.vehiculoId || null;
  console.log("el vehiculo es"+vehicleIdFromQuery)

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ReservaViaje vehicleIdFromQuery={vehicleIdFromQuery} />
    </Suspense>
  );
};

export default ReservaPage;
