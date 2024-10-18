'use client';

import React from 'react';
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/navigation';


const QrScanner: React.FC = () => {
  const router = useRouter(); // Hook de Next.js para la navegación

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const resultText = detectedCodes[0].rawValue; // El valor escaneado, presumiblemente el ID del producto
      if (resultText) {
        // Redirigir a la URL correcta dentro de la aplicación Next.js
        router.push(`/producto/${resultText}`);
      }
    }
  };

  const handleError = (error: unknown) => {
    console.error(`Error al escanear: ${error}`);
  };

  return (
    <div className="w-full h-full">
      <Scanner
        onScan={handleScan}
        onError={handleError}
        constraints={{ facingMode: 'environment' }}
      />
    </div>
  );
};

export default QrScanner;