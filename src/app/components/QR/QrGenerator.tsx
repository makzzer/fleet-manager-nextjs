'use client';
import React, { useEffect } from 'react';
import QRCode from 'qrcode';

interface QRGeneratorProps {
  value: string;
  onGenerate: (base64: string) => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ value, onGenerate }) => {
  useEffect(() => {
    const generateQR = async () => {
      if (!value) {
        console.error('QR value is empty or undefined.');
        return;
      }

      try {
        const base64Image = await QRCode.toDataURL(value, { errorCorrectionLevel: 'L', width: 256 });
        console.log('QR Base64 Generated:', base64Image);
        onGenerate(base64Image);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [value, onGenerate]);

  return null; // No necesitas renderizar nada
};

export default QRGenerator;